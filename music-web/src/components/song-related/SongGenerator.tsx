"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { inspirationTags } from "@/contants";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { toast } from "sonner";
import { generateSong } from "@/lib/actions/songGeneration";
import { type GenerateSongRequest } from "@/lib/actions/songGeneration";

const SongGenerator = () => {
  const [generationMode, setGenerationMode] = useState<"simple" | "custom">(
    "simple",
  );
  const [description, setDescription] = useState("");
  const [instrumental, setInstrumental] = useState(false);
  const [lyric, setLyric] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [lyricMode, setLyricMode] = useState<"auto" | "manual">("manual");
  const [loading, setLoading] = useState(false);

  const handleTagsClick = (tag: string) => {
    const currentTags = tagInput
      .split(", ")
      .map((s) => s.trim())
      .filter((s) => s); //filtering out empty strings

    if (!currentTags.includes(tag)) {
      if (tagInput.trim() === "") {
        setTagInput(tag);
      } else {
        setTagInput(tagInput + ", " + tag);
      }
    }
  };

  const handleCreate = async () => {
    if (generationMode === "simple" && !description.trim()) {
      toast.error("Your description is empty!");
      return;
    }
    if (generationMode === "custom" && !lyric.trim()) {
      toast.error("Your lyric is empty!");
      return;
    }
    let requestBody: GenerateSongRequest = {
      inferStep: 30,
      guidanceScale: 3.5,
      guidanceScaleText: 2,
      guidanceScaleLyric: 2,
      schedulerType: "euler",
      useErgTag: false,
      useErgLyric: false,
      useErgDiffusion: false,
      guidanceInterval: 0.5,
      guidanceIntervalDecay: 0,
      seed: 42,
      cfgType: "apg",
      audioDuration: 150,
      instrumental: instrumental,
    };
    if (generationMode === "simple") {
      requestBody = {
        ...requestBody,
        fullDescribedSong: description,
      };
    } else {
      const prompt = tagInput;
      if (lyricMode === "manual") {
        requestBody = {
          ...requestBody,
          prompt,
          lyric,
        };
      } else {
        requestBody = {
          ...requestBody,
          prompt,
          describedLyrics: lyric,
        };
      }
    }

    try {
      setLoading(true);
      await generateSong(requestBody);
      setDescription("");
      setLyric("");
      setTagInput("");
    } catch (error) {
      toast.error("Failed to generate song");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary-foreground/30 flex w-full flex-col border-r lg:w-80">
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs
          value={generationMode}
          onValueChange={(value) =>
            setGenerationMode(value as "simple" | "custom")
          }
        >
          <TabsList className="w-full">
            <TabsTrigger value="simple">Simple</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="mt-6 space-y-6">
            <div className="flex flex-col gap-3">
              <label className="text-base font-medium">
                Describe Your Song
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A happy and upbeat song"
                className="min-h-32 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-base font-medium">Instrumental</label>
              <Switch
                checked={instrumental}
                onCheckedChange={setInstrumental}
              />
            </div>
          </TabsContent>

          <TabsContent value="custom" className="mt-6 space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium">Lyric</label>
                <ButtonGroup>
                  <Button
                    size="sm"
                    variant={lyricMode === "manual" ? "destructive" : "outline"}
                    className="h-7 text-xs"
                    onClick={() => {
                      setLyricMode("manual");
                    }}
                  >
                    Manual
                  </Button>
                  <ButtonGroupSeparator orientation="vertical" />
                  <Button
                    size="sm"
                    variant={lyricMode === "auto" ? "destructive" : "outline"}
                    className="h-7 text-xs"
                    onClick={() => {
                      setLyricMode("auto");
                      setLyric("");
                    }}
                  >
                    Auto
                  </Button>
                </ButtonGroup>
              </div>

              <Textarea
                placeholder={
                  lyricMode === "manual"
                    ? "Add your own lyrics"
                    : "Describe your lyrics. For example, a funky song about sadness"
                }
                value={lyric}
                onChange={(e) => {
                  setLyric(e.target.value);
                  setLyricMode("manual");
                }}
                className="min-h-32"
              />

              <div className="flex items-center justify-between">
                <label className="text-base font-medium">Instrumental</label>
                <Switch
                  checked={instrumental}
                  onCheckedChange={setInstrumental}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-3">
              <label className="text-base font-medium">Try these</label>
              <Textarea
                placeholder="Enter some styles"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="min-h-[60px] resize-none"
              />
              <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 pb-3">
                  {inspirationTags.map((tag) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex h-7 shrink-0 rounded-sm border-1 bg-transparent text-xs"
                      onClick={() => handleTagsClick(tag)}
                      key={tag}
                    >
                      <Plus />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-4 w-full border-t p-4">
          <Button className="w-full" onClick={handleCreate} disabled={loading}>
            {loading ? "Create..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SongGenerator;
