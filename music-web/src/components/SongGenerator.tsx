"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { inspirationTags } from "@/contants";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const SongGenerator = () => {
  const [mode, setMode] = useState<"simple" | "custom">("simple");
  const [description, setDescription] = useState("");

  const handleTagsClick = (tag: string) => {
    const currentTags = description
      .split(", ")
      .map((s) => s.trim())
      .filter((s) => s); //filtering out empty strings

    if (!currentTags.includes(tag)) {
      if (description.trim() === "") {
        setDescription(tag);
      } else {
        setDescription(description + ", " + tag);
      }
    }
  };

  return (
    <div className="bg-primary-foreground/30 flex w-full flex-col border-r lg:w-80">
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as "simple" | "custom")}
        >
          <TabsList className="w-full">
            <TabsTrigger value="simple">One-Click</TabsTrigger>
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

            {/* Tags */}
            <div className="flex flex-col gap-3">
              <label className="text-base font-medium">Try these</label>
              <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 pb-3">
                  {inspirationTags.map((tag) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 shrink-0 rounded-sm bg-transparent text-xs"
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
      </div>
    </div>
  );
};

export default SongGenerator;
