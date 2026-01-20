import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Connection, 
  Edge, 
  EdgeChange, 
  Node, 
  NodeChange, 
  addEdge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import { 
  AnalysisWidget, 
  UserFlowNodeData, 
  RoleNodeData,
  WidgetType, 
  CanvasSession
} from './types';
import { v4 as uuidv4 } from 'uuid';

interface RFState {
  nodes: Node<any>[];
  edges: Edge[];
  sessions: Record<string, CanvasSession>;
  currentSessionId: string;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (position?: { x: number; y: number }) => void;
  addRoleNode: (position?: { x: number; y: number }) => void;
  updateNodeTitle: (nodeId: string, title: string) => void;
  updateNodeDescription: (nodeId: string, description: string) => void;
  addInteractionWidget: (nodeId: string, type: WidgetType) => void;
  updateWidget: (nodeId: string, widgetId: string, data: Partial<AnalysisWidget>) => void;
  toggleWidgetCollapse: (nodeId: string, widgetId: string) => void;
  removeWidget: (nodeId: string, widgetId: string) => void;
  focusTarget: string | null;
  setFocusTarget: (nodeId: string | null) => void;
  createSession: () => void;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, name: string) => void;
}

const createDefaultNode = (): Node<UserFlowNodeData> => ({
  id: uuidv4(),
  type: 'userFlow',
  position: { x: 250, y: 100 },
  data: { title: '', description: '', children: [] },
});

const DEFAULT_SESSION_ID = 'default-session';
const NOW = Date.now();

const initialSession: CanvasSession = {
  id: DEFAULT_SESSION_ID,
  name: '我的第一个画布',
  createdAt: NOW,
  lastModified: NOW,
  nodes: [createDefaultNode()],
  edges: []
};

export const useStore = create<RFState>()(
  persist(
    (set, get) => ({
      sessions: { [DEFAULT_SESSION_ID]: initialSession },
      currentSessionId: DEFAULT_SESSION_ID,
      nodes: initialSession.nodes,
      edges: initialSession.edges,
      focusTarget: null,

      onNodesChange: (changes: NodeChange[]) => {
        const newNodes = applyNodeChanges(changes, get().nodes);
        set((state) => ({
          nodes: newNodes,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], nodes: newNodes, lastModified: Date.now() }
          }
        }));
      },

      onEdgesChange: (changes: EdgeChange[]) => {
        const newEdges = applyEdgeChanges(changes, get().edges);
        set((state) => ({
          edges: newEdges,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], edges: newEdges, lastModified: Date.now() }
          }
        }));
      },

      onConnect: (connection: Connection) => {
        const newEdges = addEdge({ ...connection, type: 'smoothstep', animated: true }, get().edges);
        set((state) => ({
          edges: newEdges,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], edges: newEdges, lastModified: Date.now() }
          }
        }));
      },

      addNode: (position = { x: 100, y: 100 }) => {
        const newNode: Node<UserFlowNodeData> = {
          id: uuidv4(),
          type: 'userFlow',
          position,
          data: { title: '', description: '', children: [] }
        };
        const newNodes = [...get().nodes, newNode];
        set((state) => ({ 
          nodes: newNodes,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], nodes: newNodes, lastModified: Date.now() }
          }
        }));
      },

      addRoleNode: (position = { x: 100, y: 100 }) => {
        const newNode: Node<RoleNodeData> = {
          id: uuidv4(),
          type: 'role',
          position,
          data: { title: '', description: '' }
        };
        const newNodes = [...get().nodes, newNode];
        set((state) => ({ 
          nodes: newNodes,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], nodes: newNodes, lastModified: Date.now() }
          }
        }));
      },

      updateNodeTitle: (nodeId, title) => {
        const newNodes = get().nodes.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, title } } : node);
        set((state) => ({
          nodes: newNodes,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], nodes: newNodes, lastModified: Date.now() }
          }
        }));
      },

      updateNodeDescription: (nodeId, description) => {
        const newNodes = get().nodes.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, description } } : node);
        set((state) => ({
          nodes: newNodes,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], nodes: newNodes, lastModified: Date.now() }
          }
        }));
      },

      addInteractionWidget: (nodeId, type) => {
        let newWidget: AnalysisWidget;
        const id = uuidv4();
        switch (type) {
          case WidgetType.OPPORTUNITY:
            newWidget = { id, type: WidgetType.OPPORTUNITY, problem: '', solution_idea: '', value_score: 3, isCollapsed: false };
            break;
          case WidgetType.DECISION:
            newWidget = { id, type: WidgetType.DECISION, title: '', options: [], final_decision: '', reasoning: '', isCollapsed: false };
            break;
          case WidgetType.TODO:
            newWidget = { id, type: WidgetType.TODO, description: '', owner: '', status: 'open', isCollapsed: false };
            break;
          default: return;
        }

        const newNodes = get().nodes.map((node) => {
          if (node.id === nodeId && node.type === 'userFlow') {
            return { ...node, data: { ...node.data, children: [...node.data.children, newWidget] } };
          }
          return node;
        });

        set((state) => ({
          nodes: newNodes,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], nodes: newNodes, lastModified: Date.now() }
          }
        }));
      },

      updateWidget: (nodeId, widgetId, data) => {
        const newNodes = get().nodes.map((node) => {
          if (node.id === nodeId && node.type === 'userFlow') {
            return {
              ...node,
              data: { ...node.data, children: node.data.children.map(w => w.id === widgetId ? { ...w, ...data } as AnalysisWidget : w) }
            };
          }
          return node;
        });
        set((state) => ({
          nodes: newNodes,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], nodes: newNodes, lastModified: Date.now() }
          }
        }));
      },

      toggleWidgetCollapse: (nodeId, widgetId) => {
        const newNodes = get().nodes.map((node) => {
          if (node.id === nodeId && node.type === 'userFlow') {
            return {
              ...node,
              data: { ...node.data, children: node.data.children.map(w => w.id === widgetId ? { ...w, isCollapsed: !w.isCollapsed } as AnalysisWidget : w) }
            };
          }
          return node;
        });
        set((state) => ({
          nodes: newNodes,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], nodes: newNodes, lastModified: Date.now() }
          }
        }));
      },

      removeWidget: (nodeId, widgetId) => {
        const newNodes = get().nodes.map((node) => {
          if (node.id === nodeId && node.type === 'userFlow') {
            return { ...node, data: { ...node.data, children: node.data.children.filter(w => w.id !== widgetId) } };
          }
          return node;
        });
        set((state) => ({
          nodes: newNodes,
          sessions: {
            ...state.sessions,
            [state.currentSessionId]: { ...state.sessions[state.currentSessionId], nodes: newNodes, lastModified: Date.now() }
          }
        }));
      },

      setFocusTarget: (nodeId) => { set({ focusTarget: nodeId }); },

      createSession: () => {
        const newId = uuidv4();
        const now = Date.now();
        const newSession: CanvasSession = {
          id: newId,
          name: `未命名画布 ${Object.keys(get().sessions).length + 1}`,
          createdAt: now,
          lastModified: now,
          nodes: [createDefaultNode()],
          edges: []
        };
        set((state) => ({
          sessions: { ...state.sessions, [newId]: newSession },
          currentSessionId: newId,
          nodes: newSession.nodes,
          edges: newSession.edges
        }));
      },

      switchSession: (sessionId) => {
        const session = get().sessions[sessionId];
        if (session) {
          set({ currentSessionId: sessionId, nodes: session.nodes, edges: session.edges });
        }
      },

      deleteSession: (sessionId) => {
        const { sessions, currentSessionId } = get();
        if (Object.keys(sessions).length <= 1) return;
        const newSessions = { ...sessions };
        delete newSessions[sessionId];
        let newCurrentId = currentSessionId === sessionId ? Object.keys(newSessions)[0] : currentSessionId;
        const nextSession = newSessions[newCurrentId];
        set({ sessions: newSessions, currentSessionId: newCurrentId, nodes: nextSession?.nodes || [createDefaultNode()], edges: nextSession?.edges || [] });
      },

      renameSession: (sessionId, name) => {
        set((state) => ({ sessions: { ...state.sessions, [sessionId]: { ...state.sessions[sessionId], name } } }));
      }
    }),
    {
      name: 'ux-canvas-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ sessions: state.sessions, currentSessionId: state.currentSessionId }),
      onRehydrateStorage: () => (state) => {
        if (state && state.sessions && state.currentSessionId) {
          const currentSession = state.sessions[state.currentSessionId];
          if (currentSession) {
            state.nodes = currentSession.nodes || [];
            state.edges = currentSession.edges || [];
          }
        }
      }
    }
  )
);
