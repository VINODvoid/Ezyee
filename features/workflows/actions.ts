"use server"

import { auth } from "@clerk/nextjs/server"
import { tasks } from "@trigger.dev/sdk"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  createWorkflow,
  deleteWorkflow,
  saveWorkflowGraph,
} from "@/features/workflows/data"
import { liveblocks } from "@/lib/liveblocks"
import type { WorkflowGraph } from "@/lib/db/schema"
import type { helloWorldTask } from "@/trigger/example"

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  const workflow = await createWorkflow(orgId, name)

  revalidatePath("/", "layout")
  redirect(`/workflows/${workflow.id}`)
}

export async function deleteWorkflowAction(id: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  await deleteWorkflow(orgId, id)

  // Clean up the workflow's Liveblocks room (room id === workflow id).
  await liveblocks.deleteRoom(id)

  revalidatePath("/", "layout")
  redirect("/")
}

export async function runWorkflowAction(id: string, graph: WorkflowGraph) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  // Persist the current graph — validates structurally and throws with the
  // problems joined if the workflow isn't runnable.
  await saveWorkflowGraph({ orgId, id, graph })

  const handle = await tasks.trigger<typeof helloWorldTask>("hello-world", {
    workflowId: id,
  })

  return { id: handle.id, publicAccessToken: handle.publicAccessToken }
}
