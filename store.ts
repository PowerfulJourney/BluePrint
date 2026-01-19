import { create } from 'zustand';
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
  WidgetType, 
  OpportunityWidget, 
  TodoWidget 
} from './types';
import { v4 as uuidv4 } from 'uuid';

interface RFState {
  nodes: Node<UserFlowNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  // Actions
  addNode: (position?: { x: number; y: number }) => void;
  updateNodeTitle: (nodeId: string, title: string) => void;
  updateNodeDescription: (nodeId: string, description: string) => void;
  
  // Widget Actions
  addInteractionWidget: (nodeId: string, type: WidgetType) => void;
  updateWidget: (nodeId: string, widgetId: string, data: Partial<AnalysisWidget>) => void;
  toggleWidgetCollapse: (nodeId: string, widgetId: string) => void;
  removeWidget: (nodeId: string, widgetId: string) => void;
  
  // Navigation
  focusTarget: string | null;
  setFocusTarget: (nodeId: string | null) => void;
}

// Initial Data
const initialNodes: Node<UserFlowNodeData>[] = [
  {
    id: '1',
    type: 'userFlow',
    position: { x: 250, y: 100 },
    data: {
      title: '登录页面',
      description: '用户到达落地页并点击登录。',
      children: [
        {
          id: 'w-1',
          type: WidgetType.OPPORTUNITY,
          problem: '密码输入框流失率高',
          solution_idea: '实现魔法链接登录',
          value_score: 5,
          isCollapsed: false
        } as OpportunityWidget,
        {
          id: 'w-2',
          type: WidgetType.TODO,
          description: '与品牌团队确认错误状态颜色',
          owner: '设计系统',
          status: 'open',
          isCollapsed: true
        } as TodoWidget
      ]
    },
  },
  {
    id: '2',
    type: 'userFlow',
    position: { x: 700, y: 100 },
    data: {
      title: '仪表盘首页',
      description: '认证成功后的首屏视图。',
      children: []
    },
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'smoothstep' }
];

export const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  focusTarget: null,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, type: 'smoothstep', animated: true }, get().edges),
    });
  },

  addNode: (position = { x: 100, y: 100 }) => {
    const newNode: Node<UserFlowNodeData> = {
      id: uuidv4(),
      type: 'userFlow',
      position,
      data: {
        title: '新步骤',
        description: '',
        children: []
      }
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeTitle: (nodeId, title) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, title } };
        }
        return node;
      }),
    });
  },

  updateNodeDescription: (nodeId, description) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, description } };
        }
        return node;
      }),
    });
  },

  addInteractionWidget: (nodeId, type) => {
    let newWidget: AnalysisWidget;
    const id = uuidv4();

    switch (type) {
      case WidgetType.OPPORTUNITY:
        newWidget = {
          id,
          type: WidgetType.OPPORTUNITY,
          problem: '',
          solution_idea: '',
          value_score: 3,
          isCollapsed: false
        };
        break;
      case WidgetType.DECISION:
        newWidget = {
          id,
          type: WidgetType.DECISION,
          title: '设计决策',
          options: [],
          final_decision: '',
          reasoning: '',
          isCollapsed: false
        };
        break;
      case WidgetType.TODO:
        newWidget = {
          id,
          type: WidgetType.TODO,
          description: '',
          owner: '',
          status: 'open',
          isCollapsed: false
        };
        break;
      default:
        return;
    }

    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              children: [...node.data.children, newWidget]
            }
          };
        }
        return node;
      })
    });
  },

  updateWidget: (nodeId, widgetId, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              children: node.data.children.map(w => 
                w.id === widgetId ? { ...w, ...data } as AnalysisWidget : w
              )
            }
          };
        }
        return node;
      })
    });
  },

  toggleWidgetCollapse: (nodeId, widgetId) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              children: node.data.children.map(w => 
                w.id === widgetId ? { ...w, isCollapsed: !w.isCollapsed } as AnalysisWidget : w
              )
            }
          };
        }
        return node;
      })
    });
  },

  removeWidget: (nodeId, widgetId) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              children: node.data.children.filter(w => w.id !== widgetId)
            }
          };
        }
        return node;
      })
    });
  },

  setFocusTarget: (nodeId) => {
    set({ focusTarget: nodeId });
  }
}));