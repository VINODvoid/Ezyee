import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { createWorkflowAction } from "@/features/workflows/actions"
import { WorkflowNav } from "@/features/workflows/components/workflow-nav"
import { listWorkflows } from "@/features/workflows/data"

// The workflow list is not critical to the shell, so a transient database
// failure (e.g. a Neon cold start) degrades to an empty list instead of
// crashing the whole dashboard layout.
async function safeListWorkflows(orgId: string | null | undefined) {
  if (!orgId) return []

  try {
    return await listWorkflows(orgId)
  } catch (error) {
    console.error("Failed to load workflows for the sidebar:", error)
    return []
  }
}

export async function AppSidebar() {
  const { orgId } = await auth()
  const workflows = await safeListWorkflows(orgId)

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="flex-row items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
        <div className="min-w-0 group-data-[collapsible=icon]:hidden">
          <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"

            hidePersonal
            appearance={{
              elements: {
                rootBox: "min-w-0",
                organizationSwitcherTrigger: "max-w-full",
              },
            }}
          />
        </div>
        <SidebarTrigger className="size-8 shrink-0" />
      </SidebarHeader>
      <SidebarContent>
        <WorkflowNav
          workflows={workflows}
          createWorkflowAction={createWorkflowAction}
        />
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:items-center">
        <UserButton
          showName
          appearance={{
            elements: {
              rootBox: "w-full",
              userButtonTrigger:
                "w-full justify-start gap-2 rounded-md p-2 hover:bg-sidebar-accent group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
              userButtonOuterIdentifier:
                "truncate group-data-[collapsible=icon]:hidden",
            },
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
