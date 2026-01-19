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

// Data structure for the React Flow Node
export interface UserFlowNodeData {
  title: string;
  description: string;
  children: AnalysisWidget[];
}

// Helper type for Zustand
export interface AppState {
  // Navigation
  focusedNodeId: string | null;
  setFocusedNodeId: (id: string | null) => void;
}