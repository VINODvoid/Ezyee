"use client"

import React, { useCallback, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import {
  addEdge,
  Controls,
  ReactFlow,
  useEdgesState,
  ConnectionLineType,
  useNodesState,
  type ColorMode,
  type Edge,
  type OnConnect,
  NodeTypes,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import { StepNode } from "@/features/workflows/components/step-node"
import { nodeRegistry, type StepNodeType } from "@/features/workflows/nodes/node-registry"

const nodeTypes:NodeTypes = {
  step: StepNode,
}

const initialNodes:StepNodeType[] = [
  {
    id:"start",
    type:"step",
    position:{x:0,y:0},
    data:{
      type:"start",
      kind:"trigger",
      title:"Start",
      values:{},
    }
  }
]

const initialEdges: Edge[] = []

const emptySubscribe = () => () => {}

// false during server render and hydration, true after mount — keeps the
// server and client render identical to avoid a theme hydration mismatch.
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export function Canvas() {
  const mounted = useMounted()
  const { resolvedTheme } = useTheme()
  const colorMode: ColorMode = mounted ? (resolvedTheme as ColorMode) : "dark"

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="size-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={colorMode}
        fitView
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{stroke:"var(--border)"}}
        defaultEdgeOptions={{
          type:"smoothstep",
          style:{
            stroke:"var(--border)",
          }
        }}
        style={{
          "--xy-background-color":"var(--background)",
          "--xy-edge-stroke-width":2,
          "--xy-connectionline-stroke-width":2,

        } as React.CSSProperties}
        maxZoom={1}
      >
        {/* <Background /> */}
        <Controls />
        {/* <MiniMap /> */}
      </ReactFlow>
    </div>
  )
}
