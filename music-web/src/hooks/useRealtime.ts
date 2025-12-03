"use client";

import { useRealtime } from "@/lib/realtime/realtime-client";
import { useState } from "react";

interface WorkflowStep {
  stepName: string;
  result?: unknown;
}

export function useWorkflowWithRealtime(workflowRunId: string | null) {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [isRunFinished, setIsRunFinished] = useState(false);

  // Subscribe to workflow updates
  useRealtime({
    enabled: !!workflowRunId,
    channels: workflowRunId ? [workflowRunId] : [],
    events: ["workflow.stepFinish", "workflow.runFinish"],
    onData({ event, data }) {
      if (event === "workflow.stepFinish") {
        setSteps((prev) => [
          ...prev,
          {
            stepName: data.stepName,
            result: data.result,
          },
        ]);
      } else if (event === "workflow.runFinish") {
        setIsRunFinished(true);
      }
    },
  });

  return {
    steps,
    isRunFinished,
  };
}