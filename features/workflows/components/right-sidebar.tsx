"use client"

import { useState, useTransition } from "react"
import { useRealtimeRun } from "@trigger.dev/react-hooks"
import { PlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { runWorkflowAction } from "@/features/workflows/actions"
import type { helloWorldTask } from "@/trigger/example"

type RunHandle = { id: string; publicAccessToken: string }

export function RightSidebar() {
  const [handle, setHandle] = useState<RunHandle | null>(null)
  const [isPending, startTransition] = useTransition()

  const { run, error } = useRealtimeRun<typeof helloWorldTask>(
    handle?.id ?? "",
    {
      accessToken: handle?.publicAccessToken ?? "",
      enabled: !!handle,
    }
  )

  const handleRun = () => {
    startTransition(async () => {
      setHandle(await runWorkflowAction())
    })
  }

  return (
    <div className="flex size-full flex-col gap-3 p-2">
      <Button onClick={handleRun} disabled={isPending}>
        <PlayIcon />
        Run
      </Button>

      {handle && (
        <div className="text-sm">
          {error ? (
            <p className="text-destructive">{error.message}</p>
          ) : run ? (
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground">Status: {run.status}</p>
              {run.output?.message ? <p>{run.output.message}</p> : null}
            </div>
          ) : (
            <p className="text-muted-foreground">Starting…</p>
          )}
        </div>
      )}
    </div>
  )
}
