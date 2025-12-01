import { useWorkflowWithRealtime } from "@/hooks/useRealtime"


const SongCreation = (workflowRunId: string | null) => {
      const { steps, isRunFinished } = useWorkflowWithRealtime(workflowRunId);
  return (
    <div>
        {steps.map((step, index) => (
          <div key={index}>
            <strong>{step.stepName}</strong>
            {Boolean(step.result) && <span>: {JSON.stringify(step.result)}</span>}
          </div>
        ))}

        <span>{isRunFinished}</span>
      </div>
  )
}

export default SongCreation