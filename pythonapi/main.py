import modal
import os
import uuid
import base64
import requests
from pydantic import BaseModel

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


class GenerateMusicResponse(BaseModel):
    audio_data: str


@app.cls(
    image=image,
    gpu="T4",
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


@app.local_entrypoint()
def main():
    server = MusicGenServer()
    endpoint_url = server.generate.get_web_url()

    response = requests.post(endpoint_url)
    response.raise_for_status()
    result = GenerateMusicResponse(**response.json())

    audio_bytes = base64.decode(result.audio_data)
    output_filename = "generated.wav"
    with open(output_filename, "wb") as f:
        f.write(audio_bytes)
