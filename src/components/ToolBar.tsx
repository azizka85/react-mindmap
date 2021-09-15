import React from "react";
import { MindMapContext as ctx } from "./MindMapContext";

interface ToolBarState {
  canActivateLeftNode: boolean,
  canActivateUpNode: boolean,
  canActivateDownNode: boolean,
  canActivateRightNode: boolean,
  canSave: boolean
};

export class ToolBar extends React.Component<{}, ToolBarState> {
  constructor() {
    super({});

    ctx.toolbarUpdateCallback = this.onDataChanged.bind(this);

    this.state = {
      canActivateLeftNode: ctx.canActivateLeftNode,
      canActivateUpNode: ctx.canActivateUpNode,
      canActivateDownNode: ctx.canActivateDownNode,
      canActivateRightNode: ctx.canActivateRightNode,
      canSave: ctx.canSave
    };
  }

  onDataChanged() {
    this.setState({
      canActivateLeftNode: ctx.canActivateLeftNode,
      canActivateUpNode: ctx.canActivateUpNode,
      canActivateDownNode: ctx.canActivateDownNode,
      canActivateRightNode: ctx.canActivateRightNode,
      canSave: ctx.canSave
    });
  }

  render() {
    return (
      <div className="toolbar">
        {this.state.canActivateLeftNode
          ? <svg 
              className="tool" 
              viewBox="0 0 16 16" 
              onClick={ctx.activateLeftNode}        
            >
              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
            </svg>
          : null
        } 
        {this.state.canActivateUpNode
          ? <svg 
              className="tool" 
              viewBox="0 0 16 16" 
              onClick={ctx.activateUpNode}
            >
              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
            </svg>
          : null
        }
        {this.state.canActivateDownNode
          ? <svg 
              className="tool" 
              viewBox="0 0 16 16" 
              onClick={ctx.activateDownNode}
            >
              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
            </svg>
          : null
        }
        {this.state.canActivateRightNode
          ? <svg 
              className="tool" 
              viewBox="0 0 16 16" 
              onClick={ctx.activateRightNode}
            >
              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
            </svg>  
          : null
        }
        {this.state.canSave
          ? <svg 
              className="tool" 
              viewBox="0 0 16 16" 
              onClick={ctx.saveToLocalStorage}     
            >
              <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
            </svg>
          : null
        }
      </div>
    );
  }
}
