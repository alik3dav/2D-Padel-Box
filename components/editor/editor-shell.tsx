"use client";

import { EditorProvider } from "@/components/editor/editor-context";
import { Inspector } from "@/components/editor/inspector";
import { Sidebar } from "@/components/editor/sidebar";
import { StatusBar } from "@/components/editor/status-bar";
import { Toolbar } from "@/components/editor/toolbar";
import { Workspace } from "@/components/editor/workspace";

export function EditorShell() {
  return (
    <EditorProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#090f16] text-foreground">
        <Toolbar />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <Workspace />
          <Inspector />
        </div>
        <StatusBar />
      </div>
    </EditorProvider>
  );
}
