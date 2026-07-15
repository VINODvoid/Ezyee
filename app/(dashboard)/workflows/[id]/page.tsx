export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <p className="font-mono text-sm">
        Workflow ID: <span className="text-muted-foreground">{id}</span>
      </p>
    </div>
  )
}
