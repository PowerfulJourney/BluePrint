
// Define the specific types of analysis widgets

export enum WidgetType {
  OPPORTUNITY = 'opportunity',
  DECISION = 'decision',
  TODO = 'todo',
}

// 1. ✨ Opportunity Widget
export interface OpportunityWidget {
  id: string;
  type: WidgetType.OPPORTUNITY;
  problem: string;
  solution_idea: string;
  value_score: number; // 1-5
  isCollapsed?: boolean;
}

// 2. ⚖️ Decision Matrix Widget
export interface DecisionOption {
  id: string;
  title: string;
  pros: string;
  cons: string;
}

export interface DecisionWidget {
  id: string;
  type: WidgetType.DECISION;
  title: string; // e.g., "Navigation Pattern"
  options: DecisionOption[];
  final_decision: string; // ID of the selected option
  reasoning: string;
  isCollapsed?: boolean;
}

// 3. ❓ To Be Clarified Widget
export interface TodoWidget {
  id: string;
  type: WidgetType.TODO;
  description: string;
  owner: string;
  status: 'open' | 'resolved';
  isCollapsed?: boolean;
}

// Union type for all children
export type AnalysisWidget = OpportunityWidget | DecisionWidget | TodoWidget;

// Data structure for the React Flow Node (Step)
export interface UserFlowNodeData {
  title: string;
  description: string;
  children: AnalysisWidget[];
}

// Data structure for the Role Node
export interface RoleNodeData {
  title: string;
  description: string;
}

// Session/Canvas Metadata
export interface CanvasSession {
  id: string;
  name: string;
  createdAt: number; // For stable sorting
  lastModified: number;
  nodes: any[]; // Using any[] to avoid circular dependency issues
  edges: any[]; // Edge[]
}

// Helper type for Zustand
export interface AppState {
  // Navigation
  focusedNodeId: string | null;
  setFocusedNodeId: (id: string | null) => void;
}
