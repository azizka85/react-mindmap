export interface RootType {
  id?: number;
  children: NodeType[];
};

export interface NodeType extends RootType {  
  id: number;
  label: string;
  active: boolean;
  collapsed: boolean;
  updateCallback?: () => void;
};

const parents = new Map<number, NodeType>();

const root: RootType = {
  children: [
    getInitialNode()
  ]
};

let activeNode: NodeType | undefined = undefined;

const ctx = {
  canSave: false,
  rootCallback: () => {},
  toolbarUpdateCallback: () => {},

  get root(): RootType {
    return root;
  },

  get activeNode(): NodeType | undefined {
    return activeNode;
  },

  setNodeLabel(node: NodeType, label: string) {
    node.label = label;
    node.updateCallback?.();

    ctx.canSave = true;
    ctx.toolbarUpdateCallback?.();
  },

  setNodeActive(node: NodeType | undefined) {
    ctx.updateActiveNode(node);

    node?.updateCallback?.();
    ctx.toolbarUpdateCallback?.();        
  },

  setNodeCollapsed(node: NodeType, collapsed: boolean) {
    node.collapsed = collapsed;

    node.updateCallback?.();
    ctx.toolbarUpdateCallback?.();
  },

  parent(node: NodeType) {
    return parents.get(node.id);
  },

  canMoveToLeftNode(node: NodeType): boolean {
    return parents.get(node.id) !== undefined;
  },

  canMoveToRightNode(node: NodeType): boolean {
    return !node.collapsed && node.children.length > 0;
  },

  canMoveToUpNode(node: NodeType): boolean {
    const index = parents.get(node.id)?.children?.indexOf(node);

    return index !== undefined && index > 0;
  },

  canMoveToDownNode(node: NodeType): boolean {
    const index = parents.get(node.id)?.children?.indexOf(node);
    const length = parents.get(node.id)?.children?.length || 0;      

    return index !== undefined && index >= 0 && index < length - 1;
  },

  get canActivateLeftNode(): boolean {
    return activeNode !== undefined && ctx.canMoveToLeftNode(activeNode);
  },

  get canActivateRightNode(): boolean {
    return activeNode !== undefined && ctx.canMoveToRightNode(activeNode);
  },

  get canActivateUpNode(): boolean {
    return activeNode !== undefined && ctx.canMoveToUpNode(activeNode);
  },

  get canActivateDownNode(): boolean {
    return activeNode !== undefined && ctx.canMoveToDownNode(activeNode);
  },

  middleChildNode(node: NodeType): NodeType | undefined {
    if(node.children.length > 0) {
      const index = Math.floor((node.children.length - 1) / 2);  

      return node.children[index];
    }

    return undefined;
  },

  upNode(node: NodeType): NodeType | undefined {
    const index = parents.get(node.id)?.children?.indexOf(node); 

    if(index !== undefined && index > 0) {
      return parents.get(node.id)?.children[index-1];
    }

    return undefined;
  },

  downNode(node: NodeType): NodeType | undefined {
    const index = parents.get(node.id)?.children?.indexOf(node);
    const length = parents.get(node.id)?.children?.length || 0;   

    if(index !== undefined && index >= 0 && index < length - 1) {
      return parents.get(node.id)?.children[index + 1];
    }

    return undefined;
  },

  updateActiveNode(node: NodeType | undefined): void {
    if(!node || !activeNode || node.id !== activeNode.id) {      
      if(activeNode) {
        activeNode.active = false;
        activeNode.updateCallback?.();
      }

      if(node) {
        node.active = true;
      }

      activeNode = node;
    }
  },

  createChildNode(parent: NodeType | undefined): void {
    const newNode: NodeType = {
      id: Date.now(),
      label: '',
      active: false,
      collapsed: false,
      children: []          
    };

    addNode(parent, newNode);    
    ctx.updateActiveNode(newNode);

    if(parent) {
      parent.collapsed = false;
      parent.updateCallback?.();
    } else {
      ctx.rootCallback?.();
    }    

    ctx.canSave = true;
    ctx.toolbarUpdateCallback?.();
  },

  removeNode(node: NodeType): void {
    const parent = ctx.parent(node);
    const parentNode = parent || ctx.root;
    const index = parentNode.children.indexOf(node);
    const length = parentNode.children.length;  

    if(!parent && length < 2) return;        
  
    deleteNode(parentNode, node);    
  
    let focusIndex = parentNode.children.length - 1;
  
    if(parentNode.children.length > index) {
      focusIndex = index;
    }

    if(focusIndex >= 0) {
      const focusNode = parentNode.children[focusIndex];  

      ctx.updateActiveNode(focusNode);        
      focusNode.updateCallback?.();
    } else if(parent) {            
      ctx.updateActiveNode(parent);
    }

    if(parent) {
      parent.updateCallback?.();
    } else {
      ctx.rootCallback?.();
    }   

    ctx.canSave = true;
    ctx.toolbarUpdateCallback?.();
  },

  setChildNodesCollapsed(node: NodeType, collapsed: boolean): void {
    node.collapsed = false;
    node.updateCallback?.();

    node.children.forEach(child => {
      if(!collapsed || child.children.length > 0) {
        child.collapsed = collapsed;     
        child.updateCallback?.();
      }
    });

    ctx.toolbarUpdateCallback?.();
  },

  moveToLeftNode(node: NodeType): void {
    if(ctx.canMoveToLeftNode(node)) {
      const target = ctx.parent(node);
      ctx.updateActiveNode(target);
      ctx.toolbarUpdateCallback?.();
      target?.updateCallback?.();      
    }
  },

  moveToRightNode(node: NodeType): void {
    if(ctx.canMoveToRightNode(node)) {
      const childNode = ctx.middleChildNode(node);

      if(childNode) {
        ctx.updateActiveNode(childNode);
        ctx.toolbarUpdateCallback?.();
        childNode.updateCallback?.();        
      }
    }
  },

  moveToUpNode(node: NodeType): void {
    if(ctx.canMoveToUpNode(node)) {
      const upNode = ctx.upNode(node);

      if(upNode) {
        ctx.updateActiveNode(upNode);
        ctx.toolbarUpdateCallback?.();
        upNode.updateCallback?.();
      }
    }
  },

  moveToDownNode(node: NodeType): void {
    if(ctx.canMoveToDownNode(node)) {
      const downNode = ctx.downNode(node);

      if(downNode) {
        ctx.updateActiveNode(downNode);
        ctx.toolbarUpdateCallback?.();
        downNode.updateCallback?.();
      }
    }  
  },

  activateLeftNode(): void {
    if(activeNode && ctx.canActivateLeftNode) {
      ctx.moveToLeftNode(activeNode);
    }
  },

  activateRightNode(): void {
    if(activeNode && ctx.canActivateRightNode) {
      ctx.moveToRightNode(activeNode);
    }
  },

  activateUpNode(): void {
    if(activeNode && ctx.canActivateUpNode) {
      ctx.moveToUpNode(activeNode);
    }
  },

  activateDownNode(): void {
    if(activeNode && ctx.canActivateDownNode) {
      ctx.moveToDownNode(activeNode);
    }
  },

  saveToLocalStorage(): void {
    localStorage.setItem('mindmap', JSON.stringify(root.children));
  
    ctx.canSave = false;
    ctx.toolbarUpdateCallback?.();
  },

  loadFromLocalStorage(): void {
    let data = null;

    try {
      data = JSON.parse(localStorage.getItem('mindmap') || '');
    } catch(error) {
      console.error(error);
    }

    if(data && typeof data === 'object') {
      loadState(data);
    } else {
      setInitialState();
    }
  }
};

function getInitialNode(): NodeType {
  return {
    id: Date.now(),
    label: 'Press Space or double click to edit',
    active: false,
    collapsed: false,
    children: []      
  };
}

function addNode(parent: NodeType | undefined, newNode: NodeType) {    
  if(parent) {
    parent.children.push(newNode);
    addParent(parent, newNode);      
  } else {
    root.children.push(newNode);
  }  
}

function addParent(parent: NodeType | undefined, node: NodeType) {
  if(parent) {
    parents.set(node.id, parent);
  }
}

function deleteNode(parent: NodeType | RootType, node: NodeType) {
  const index = parent.children.findIndex(elem => elem.id === node.id);    
  parent.children.splice(index, 1);  
  parents.delete(node.id);
}

function setInitialState() {
  const initialNode = getInitialNode();

  ctx.canSave = false;
  activeNode = undefined;
  root.children = [ initialNode ];  

  parents.clear();
}

function loadState(children: NodeType[]) {
  parents.clear();

  activeNode = undefined;

  initChildren(children, undefined);  

  ctx.canSave = false;  
  root.children = children;     
}  

function initChildren(children: NodeType[], parent: NodeType | undefined) {
  children.forEach(child => {   
    if(child.active) {
      activeNode = child;
    }
    
    if(parent) {
      parents.set(child.id, parent); 
    }

    if(child.children.length > 0) {
      initChildren(child.children, child);
    }      
  });
}

export const MindMapContext = ctx;
