import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ExperimentCanvas } from "@/components/experiment-canvas";

export function App() {
  const [activeId, setActiveId] = useState<string>("character-reveal");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeId={activeId} onSelect={setActiveId} />
      <ExperimentCanvas activeId={activeId} onReplay={() => setActiveId((prev) => prev)} />
    </div>
  );
}
