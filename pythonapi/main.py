import modal
import os
import uuid
import base64
import requests
import boto3
from pydantic import BaseModel
from typing import List
from prompts import LYRICS_GENERATOR_PROMPT, PROMPT_GENERATOR_PROMPT

app = modal.App("music-generator")

image = (
    modal.Image.debian_slim()
    .apt_install("git")
    .pip_install_from_requirements("requirements.txt")
    .run_commands(["git clone https://github.com/ace-step/ACE-Step.git /tmp/ACE-Step", "cd /tmp/ACE-Step && pip install ."])
    .env({"HF_HOME": "/.cache/huggingface"})
    .add_local_python_source("prompts")
)

modal_volume = modal.Volume.from_name(
    "ace-step-models", create_if_missing=True)
hf_volume = modal.Volume.from_name("qwen-hf-cache", create_if_missing=True)

music_lib_secrets = modal.Secret.from_name("music-lib-secret")


class AudioGenerationBase(BaseModel):
    audio_duration: float = 150.0
    seed: int = -1
    guidance_scale: float = 15.0
    infer_step: int = 60
    instrumental: bool = False


class GenerateFromDescriptionRequest(AudioGenerationBase):
    full_described_song: str


class GenerateWithCustomLyricsRequest(AudioGenerationBase):
    prompt: str
    lyrics: str


class GenerateWithDescribedLyricsRequest(AudioGenerationBase):
    prompt: str
    described_lyrics: str


class GenerateMusicResponseS3(BaseModel):
    s3_key: str
    thumbnails_image_s3_key: str
    categories: List[str]


class GenerateMusicResponse(BaseModel):
    audio_data: str


@app.cls(
    image=image,
    gpu="L40S",
    volumes={"/models": modal_volume, "/.cache/huggingface": hf_volume},
    secrets=[music_lib_secrets],
    scaledown_window=5)  # models stay warm for 5 seconds
class MusicGenServer:
    @modal.enter()
    def load_model(self):
        from acestep.pipeline_ace_step import ACEStepPipeline
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from diffusers import AutoPipelineForText2Image
        import torch

        # Music Generation Model
        self.music_model = ACEStepPipeline(
            checkpoint_dir="/models",
            dtype="bfloat16",
            torch_compile=False,
            cpu_offload=False,
            overlapped_decode=False
        )

        # Large Language Model
        model_id = "Qwen/Qwen2-7B-Instruct"
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)

        self.llm_model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype="auto",
            device_map="auto",
            cache_dir="/.cache/huggingface")

        # Thumbnails Generator Model
        self.image_pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16", cache_dir="/.cache/huggingface")
        self.image_pipe.to("cuda")

    def prompt_llm(self, prompt: str):
        messages = [
            {"role": "user", "content": prompt}
        ]

        text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        model_inputs = self.tokenizer(
            [text], return_tensors="pt").to(self.llm_model.device)

        generated_ids = self.llm_model.generate(
            model_inputs.input_ids,
            max_new_tokens=512
        )
        generated_ids = [
            output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]

        response = self.tokenizer.batch_decode(
            generated_ids, skip_special_tokens=True)[0]

        return response

    def generate_prompt(self,  description: str):
        prompt = PROMPT_GENERATOR_PROMPT.format(user_prompt=description)
        return self.prompt_llm(prompt)

    def generate_lyrics(self,  description: str):
        prompt = LYRICS_GENERATOR_PROMPT.format(description=description)
        return self.prompt_llm(prompt)

    def generate_categories(self, description: str) -> List[str]:
        prompt = f"Based on the following music description, list 3-5 relevant genres or categories as a comma-separated list. For example: Pop, Electronic, Sad, 80s. Description: '{description}'"

        response_text = self.prompt_llm(prompt)
        categories = [cat.strip()
                      for cat in response_text.split(",") if cat.strip()]
        return categories

    def generate_and_upload_s3(self, prompt: str, lyrics: str, instrumental: bool, audio_duration: float, infer_step: int, guidance_scale: float, seed: int, description_for_categories: str) -> GenerateMusicResponseS3:
        final_lyrics = "instrumental" if instrumental else lyrics

        print(f"Final Lyric in generate and upload S3: {final_lyrics}")
        print(f"Final Prompt in generate and upload S3: {prompt}")

        # AWS S3: thumbnails, audio files
        s3_client = boto3.client("s3")
        bucket_name = os.environ["S3_BUCKET_NAME"]
        output_dir = "/tmp/outputs"
        os.makedirs(output_dir, exist_ok=True)

        # Audio Files
        audio_output_path = os.path.join(output_dir, f"{uuid.uuid4()}.wav")
        self.music_model(
            prompt=prompt,
            lyrics=final_lyrics,
            audio_duration=audio_duration,
            infer_step=infer_step,
            guidance_scale=guidance_scale,
            save_path=audio_output_path,
            manual_seeds=str(seed)
        )
        audio_s3_key = f"{uuid.uuid4()}.wav"
        s3_client.upload_file(
            audio_output_path, bucket_name, audio_s3_key)
        os.remove(audio_output_path)

        # Thumbnails
        thumbnails_prompt = f"{prompt}, album cover art"
        image = self.image_pipe(
            prompt=thumbnails_prompt, num_inference_steps=2, guidance_scale=0.0).images[0]
        image_s3_key = f"{uuid.uuid4()}.png"
        imgage_output_path = os.path.join(output_dir, image_s3_key)
        image.save(imgage_output_path)
        s3_client.upload_file(imgage_output_path,
                              bucket_name, f"{uuid.uuid4()}.png")
        os.remove(imgage_output_path)

        # Categories
        categories = self.generate_categories(description_for_categories)

        return GenerateMusicResponseS3(s3_key=audio_s3_key, thumbnails_image_s3_key=image_s3_key, categories=categories)

    @modal.fastapi_endpoint(method="POST")
    def generate(self) -> GenerateMusicResponse:
        output_dir = "/tmp/outputs"
        os.makedirs(output_dir, exist_ok=True)

        output_path = os.path.join(output_dir, f"{uuid.uuid4()}.wav")
        self.music_model(
            prompt="rock, hip - hop, orchestral, bass, drums, electric guitar, piano, synthesizer, violin, viola, cello, fast, energetic, motivational, inspirational, empowering",
            lyrics="### **[Intro – Spoken]**  \n*\"The streets whisper, their echoes never fade.  \nEvery step I take leaves a mark—this ain't just a game.\"*  \n\n### **[Hook/Chorus]**  \nBorn in the chaos, I weather the storm,  \nRising from ashes where warriors are born.  \nChains couldn't hold me, the system’s a maze,  \nI rewrite the rules, set the city ablaze!  \n\n### **[Verse 1]**  \nCold nights, empty pockets, dreams laced with fight,  \nEvery loss made me sharper, cut deep like a knife.  \nThey said I wouldn’t make it, now they watch in despair,  \nFrom the curb to the throne, took the pain, made it rare.  \nEvery siren’s a melody, every alley holds a tale,  \nRose from the shadows, left my name on the trail.  \nStreetlights flicker like warnings in the haze,  \nBut I move like a phantom, unfazed by the blaze.  \n\n### **[Hook/Chorus]**  \nBorn in the chaos, I weather the storm,  \nRising from ashes where warriors are born.  \nChains couldn't hold me, the system’s a maze,  \nI rewrite the rules, set the city ablaze!  \n\n### **[Verse 2]**  \nBarbed wire fences couldn't lock in my mind,  \nEvery cage they designed, I left broken behind.  \nThey want control, but I’m destined to roam,  \nWhere the lost find their voice, where the heart sets the tone.  \nSteel and concrete, where the lessons run deep,  \nEvery crack in the pavement tells a story of heat.  \nBut I rise, undefeated, like a king with no throne,  \nWriting scripts in the struggle, my legacy’s stone.  \n\n### **[Bridge]**  \nFeel the rhythm of the underground roar,  \nEvery wound tells a story of the battles before.  \nBlood, sweat, and echoes fill the cold midnight,  \nBut we move with the fire—unshaken, upright.  \n\n### **[Verse 3]**  \nNo regrets, no retreat, this game has no pause,  \nEvery step that I take is a win for the lost.  \nI took lessons from hustlers, wisdom from pain,  \nNow the echoes of struggle carve power in my name.  \nThey built walls, but I walk through the cracks,  \nTurned dirt into gold, never looked back.  \nThrough the struggle we rise, through the fire we claim,  \nThis is more than just music—it's life in the frame.  \n\n### **[Hook/Chorus – Reprise]**  \nBorn in the chaos, I weather the storm,  \nRising from ashes where warriors are born.  \nChains couldn't hold me, the system’s a maze,  \nI rewrite the rules, set the city ablaze!  \n\n### **[Outro – Spoken]**  \n*\"The scars, the struggle, the grind—it’s all part of the rhythm.  \nWe never break, we never fold. We rise.\"*",
            audio_duration=153.95997916666667,
            infer_step=60,
            guidance_scale=15,
            save_path=output_path,
        )

        with open(output_path, "rb") as f:
            audio_bytes = f.read()

        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")

        os.remove(output_path)

        return GenerateMusicResponse(audio_data=audio_b64)

    @modal.fastapi_endpoint(method="POST")
    def generate_from_desc(self, req: GenerateFromDescriptionRequest) -> GenerateMusicResponseS3:
        # Generate a promt
        prompt = self.generate_prompt(req.full_described_song)
        # Generate lyrics
        lyrics = ""
        if not req.instrumental:
            lyrics = self.generate_lyrics(req.full_described_song)

        return self.generate_and_upload_s3(prompt=prompt, lyrics=lyrics, description_for_categories=req.full_described_song, **req.model_dump(exclude={"full_described_song"}))

    @modal.fastapi_endpoint(method="POST")
    def generate_with_lyrics(self, req: GenerateWithCustomLyricsRequest) -> GenerateMusicResponseS3:
        return self.generate_and_upload_s3(prompt=req.prompt, lyrics=req.lyrics, description_for_categories=req.prompt, **req.model_dump(exclude={"prompt", "lyrics"}))

    @modal.fastapi_endpoint(method="POST")
    def generate_with_described_lyrics(self, req: GenerateWithDescribedLyricsRequest) -> GenerateMusicResponseS3:
        # Generate lyric
        lyrics = ""
        if not req.instrumental:
            lyrics = self.generate_lyrics(req.described_lyrics)

        return self.generate_and_upload_s3(prompt=req.prompt, lyrics=lyrics, description_for_categories=req.prompt, **req.model_dump(exclude={"described_lyrics", "prompt"}))


@app.local_entrypoint()
def main():
    server = MusicGenServer()
    endpoint_url = server.generate_with_described_lyrics.get_web_url()

    request_data = GenerateWithDescribedLyricsRequest(
        prompt="synthwave, retro, 100 BPM, electronic, neon vibes",
        described_lyrics="lyrics about ambition, money, and surviving tough times",
        guidance_scale=13
    )

    payload = request_data.model_dump()

    response = requests.post(endpoint_url, json=payload)
    response.raise_for_status()
    result = GenerateMusicResponseS3(**response.json())

    print(
        f"Music Generation Success: {result.s3_key} {result.thumbnails_image_s3_key} {result.categories}")
