"use client"

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { Plus, Workflow } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const workflows = [
  "dominant-wasp",
  "honest-reindeer",
  "expected-llama",
  "essential-ocelot",
  "creepy-echidna",
  "eastern-silkworm",
  "cultural-lion",
  "proud-weasel",
  "regional-bonobo",
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="flex-row items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
        <div className="min-w-0 group-data-[collapsible=icon]:hidden">
          <OrganizationSwitcher
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
        <SidebarGroup>
          <SidebarGroupLabel>Workflows</SidebarGroupLabel>
          <SidebarGroupAction title="New workflow">
            <Plus />
            <span className="sr-only">New workflow</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {workflows.map((workflow, index) => (
                <SidebarMenuItem key={workflow}>
                  <SidebarMenuButton isActive={index === 0} tooltip={workflow}>
                    <Workflow />
                    <span>{workflow}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
