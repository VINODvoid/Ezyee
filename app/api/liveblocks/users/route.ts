import { auth, clerkClient } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { userIds } = (await request.json()) as { userIds: string[] }

  if (userIds.length === 0) {
    return Response.json([])
  }

  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({
    userId: userIds,
    limit: userIds.length,
  })

  const usersById = new Map(users.map((user) => [user.id, user]))

  // Return display info in the same order as the requested ids, null for unknown.
  const result = userIds.map((id) => {
    const user = usersById.get(id)
    if (!user) return null

    return {
      name:
        user.fullName ??
        user.username ??
        user.primaryEmailAddress?.emailAddress ??
        "Anonymous",
      avatar: user.imageUrl,
    }
  })

  return Response.json(result)
}
