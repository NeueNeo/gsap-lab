import { ChevronRight } from "lucide-react";
import { categories, topLevelCount, type Experiment } from "@/lib/experiments";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AppSidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
}

function ExperimentMenuItem({
  exp,
  activeId,
  onSelect,
}: {
  exp: Experiment;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const hasChildren = exp.children && exp.children.length > 0;
  const isActive = exp.id === activeId;
  const childActive = hasChildren && exp.children!.some((c) => c.id === activeId);

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => onSelect(exp.id)}
          className="cursor-pointer"
        >
          <span>{exp.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible asChild defaultOpen={isActive || childActive} className="group/collapsible">
      <SidebarMenuItem>
        <div className="relative">
          <SidebarMenuButton
            isActive={isActive || childActive}
            onClick={() => onSelect(exp.id)}
            tooltip={exp.name}
            className="cursor-pointer pr-8"
          >
            <span>{exp.name}</span>
          </SidebarMenuButton>
          <CollapsibleTrigger asChild>
            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
              <ChevronRight className="size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <SidebarMenuSub>
            {exp.children!.map((child) => (
              <SidebarMenuSubItem key={child.id}>
                <SidebarMenuSubButton
                  isActive={child.id === activeId}
                  onClick={() => onSelect(child.id)}
                  className="cursor-pointer"
                >
                  <span>{child.name}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function AppSidebar({ activeId, onSelect }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <h1 className="text-lg font-semibold tracking-tight">GSAP Lab</h1>
        <p className="text-xs font-mono text-sidebar-foreground/50">
          {topLevelCount} animation experiments
        </p>
      </SidebarHeader>
      <SidebarContent>
        {categories.map((cat) => (
          <SidebarGroup key={cat.name}>
            <SidebarGroupLabel className="uppercase tracking-widest text-[11px] font-mono">
              {cat.name}
              <SidebarMenuBadge className="ml-2 text-[10px]">
                {cat.experiments.length}
              </SidebarMenuBadge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {cat.experiments.map((exp) => (
                  <ExperimentMenuItem
                    key={exp.id}
                    exp={exp}
                    activeId={activeId}
                    onSelect={onSelect}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-4 py-3">
        <p className="text-[11px] font-mono text-sidebar-foreground/30">
          Built with GSAP + React + Vite
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
