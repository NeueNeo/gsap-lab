import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { ExperimentCanvas } from "@/components/experiment-canvas";

export function App() {
  const [activeId, setActiveId] = useState<string>("character-reveal");

  return (
    <SidebarProvider>
      <AppSidebar activeId={activeId} onSelect={setActiveId} />
      <SidebarInset>
        <ExperimentCanvas activeId={activeId} onReplay={() => setActiveId((prev) => prev)} />
      </SidebarInset>
    </SidebarProvider>
  );
}
