import React from "react";
import { MindMapContext as ctx, RootType } from "./MindMapContext";
import { Node } from "./Node";
import { ToolBar } from "./ToolBar";

interface MindMapState {
  root: RootType
};

export class MindMap extends React.Component<{}, MindMapState> {
  constructor() {
    super({});

    ctx.loadFromLocalStorage();
    
    ctx.rootCallback = this.onDataChanged.bind(this);

    this.state = {
      root: ctx.root
    };
  }

  onDataChanged() {
    this.setState({
      root: ctx.root
    });
  }

  render() {
    return (
      <div className="container">
        <ToolBar />
        <ul 
          className="mindmap" 
          onClick={() => ctx.setNodeActive(undefined)}
        >
            {this.state.root.children.map((node, index) => <Node 
              key={node.id}
              node={node}
              tabIndex={index}
            />)}
          </ul>
      </div>
    );
  }
}
