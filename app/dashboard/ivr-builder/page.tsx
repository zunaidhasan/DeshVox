"use client";

import { useCallback, useState } from "react";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Bot, GitBranch, Play, Plus, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const nodeTypes = [
  "Greeting",
  "Menu",
  "Route to Department",
  "Collect Info",
  "Transfer to Agent",
  "Play Message",
  "End Call"
];

const initialNodes: Node[] = [
  { id: "greeting", type: "default", position: { x: 80, y: 80 }, data: { label: "Greeting: স্বাগতম" } },
  { id: "menu", type: "default", position: { x: 360, y: 80 }, data: { label: "Menu: Press 1 Sales, 2 Support" } },
  { id: "ai", type: "default", position: { x: 640, y: 80 }, data: { label: "Smart AI Routing" } }
];

const initialEdges: Edge[] = [
  { id: "greeting-menu", source: "greeting", target: "menu" },
  { id: "menu-ai", source: "menu", target: "ai" }
];

export default function IvrBuilderPage() {
  const [flowName, setFlowName] = useState("Main Business IVR");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [message, setMessage] = useState("Ready to test your call flow.");

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  function addNode(label: string) {
    const id = `${label}-${Date.now()}`;
    setNodes((current) => [
      ...current,
      {
        id,
        type: "default",
        position: { x: 120 + current.length * 40, y: 220 + current.length * 18 },
        data: { label }
      }
    ]);
  }

  function saveFlow() {
    localStorage.setItem("deshvox-ivr-flow", JSON.stringify({ flowName, nodes, edges }));
    setMessage("Flow saved locally. With Supabase keys, persist this payload to public.ivr_flows.");
  }

  function testFlow() {
    const labels = nodes.map((node) => String(node.data.label)).join(" -> ");
    setMessage(`Simulation: Caller enters ${labels}. AI routing can transfer to the best available agent.`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">No-Code IVR Flow Builder</h1>
          <p className="mt-2 text-muted-foreground">Drag, connect and test call journeys without writing code.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={saveFlow}><Save className="h-4 w-4" /> Save Flow</Button>
          <Button className="gap-2" onClick={testFlow}><Play className="h-4 w-4" /> Test Simulation</Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-primary" /> Nodes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={flowName} onChange={(event) => setFlowName(event.target.value)} />
            <div className="space-y-2">
              {nodeTypes.map((type) => (
                <Button key={type} variant="outline" className="w-full justify-start gap-2" onClick={() => addNode(type)}>
                  <Plus className="h-4 w-4" /> {type}
                </Button>
              ))}
            </div>
            <div className="rounded-lg border bg-muted/35 p-3">
              <Badge className="gap-1"><Bot className="h-3 w-3" /> Smart AI routing</Badge>
              <p className="mt-2 text-sm text-muted-foreground">Use caller intent, language and history to route automatically.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>{flowName}</CardTitle>
          </CardHeader>
          <CardContent className="h-[640px] p-0">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <MiniMap nodeColor={() => "#008000"} />
              <Controls />
              <Background />
            </ReactFlow>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">{message}</CardContent>
      </Card>
    </div>
  );
}
