"use client";

import { useState } from "react";
import { useRealtime } from "@/lib/realtime/realtime-client";
import { useWorkflowWithRealtime } from "@/hooks/useRealtime";

export default function SongCreation({ songId }: { songId: string }) {
  const [workflowRunId, setWorkflowRunId] = useState<string | null>(null);

  // Subscribe to global channel to detect new workflows for this songId
  useRealtime({
    channels: ["workflows-global"],
    events: ["workflow.started"],
    onData({ event, data }) {
      if (event === "workflow.started" && data.songId === songId) {
        console.log("Workflow started for song:", songId, data);
        setWorkflowRunId(data.workflowRunId);
      }
    },
  });

  const { steps, isRunFinished } = useWorkflowWithRealtime(workflowRunId);

  return (
    <div>
      {!workflowRunId ? (
        <p>Waiting for workflow to start for song {songId}...</p>
      ) : (
        <>
          <p>Workflow Run ID: {workflowRunId}</p>

          {steps.map((step, idx) => (
            <div key={idx}>
              <strong>{step.stepName}</strong>
              {Boolean(step.result) && <span>: {JSON.stringify(step.result)}</span>}
            </div>
          ))}

          {isRunFinished && <p>Workflow Finished ✅</p>}
        </>
      )}
    </div>
  );
}
