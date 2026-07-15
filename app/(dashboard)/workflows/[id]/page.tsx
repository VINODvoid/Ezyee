import { auth } from "@clerk/nextjs/server"
import { ReactFlowProvider } from "@xyflow/react"
import { notFound } from "next/navigation"

import { Room } from "@/features/workflows/components/room"
import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { getWorkflow } from "@/features/workflows/data"
import { liveblocks } from "@/lib/liveblocks"

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { orgId } = await auth()
  if (!orgId) notFound()

  const workflow = await getWorkflow(orgId, id)
  if (!workflow) notFound()

  // Ensure the Liveblocks room exists and grants write access to the org,
  // matching the orgId groupIds set in the auth endpoint.
  await liveblocks.getOrCreateRoom(id, {
    defaultAccesses: [],
    groupsAccesses: { [orgId]: ["room:write"] },
    organizationId:orgId
  })

  return (
    // One React Flow store above both the canvas and the sidebar palette so
    // they share the same nodes/edges instance.
    <ReactFlowProvider>
      <Room roomId={id}>
        <WorkflowShell workflowId={id} />
      </Room>
    </ReactFlowProvider>
  )
}
