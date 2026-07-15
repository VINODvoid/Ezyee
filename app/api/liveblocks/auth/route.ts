import { auth, currentUser } from "@clerk/nextjs/server"

import { liveblocks } from "@/lib/liveblocks"

export async function POST() {
  const { userId, orgId } = await auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const user = await currentUser()

  // ID token auth: identify the user and scope access by their active Clerk
  // organization via groupIds, so room permissions can be granted per org.
  const { status, body } = await liveblocks.identifyUser(
    {
      userId,
      groupIds: orgId ? [orgId] : [],
      organizationId:orgId
    },
    {
      userInfo: {
        name:
          user?.fullName ??
          user?.username ??
          user?.primaryEmailAddress?.emailAddress ??
          "Anonymous",
        avatar: user?.imageUrl,
      },
    }
  )

  return new Response(body, { status })
}
