import classNames from "classnames";
import React, { KeyboardEvent, MouseEvent } from "react";
import { NodeType } from "./MindMapContext";
import { MindMapContext as ctx } from "./MindMapContext";

interface NodeProps {
  node: NodeType,
  tabIndex: number
};

interface NodeState {
  id: number,
  label: string,
  active: boolean,
  collapsed: boolean,  
  children: NodeType[]
};

export class Node extends React.Component<NodeProps, NodeState> {
  protected articleRef: React.RefObject<HTMLElement>;
  protected childrenCollapsed: boolean;

  constructor(props: NodeProps) {
    super(props);

    this.childrenCollapsed = false;
    this.articleRef = React.createRef<HTMLElement>();

    props.node.updateCallback = this.onDataChanged.bind(this);
    this.onNodeInput = this.onNodeInput.bind(this);
    this.onNodeClicked = this.onNodeClicked.bind(this);
    this.onNodeKeyPressed = this.onNodeKeyPressed.bind(this);

    this.state = {
      id: props.node.id,
      label: props.node.label,
      active: props.node.active,
      collapsed: props.node.collapsed,
      children: props.node.children,      
    };
  }

  componentDidMount() {
    this.updateArticleContent(this.state.label);
    this.updateArticleFocus(this.state.active);
  }

  componentDidUpdate() {
    this.updateArticleContent(this.state.label);
    this.updateArticleFocus(this.state.active);
  }

  onDataChanged() {
    this.setState({
      ...this.props.node
    });
  }

  updateArticleContent(content: string | null) {
    if(this.articleRef.current) {
      this.articleRef.current.textContent = content;
    }    
  }

  updateArticleFocus(active: boolean | undefined) {
    if(active) {
      this.articleRef.current?.focus();
    } else {
      this.articleRef.current?.blur();
    }
  }

  onNodeInput() {       
    ctx.setNodeLabel(
      this.props.node, 
      this.articleRef.current?.textContent?.replace(/(<([^>]+)>)/gi, "") || ''
    );
  }

  onNodeClicked(evt: MouseEvent<HTMLElement>) {
    evt.stopPropagation();

    ctx.setNodeActive(this.props.node);
  }

  onNodeKeyPressed(evt: KeyboardEvent<HTMLElement>) {
    if(evt.code === 'Tab') {
      evt.preventDefault();

      ctx.createChildNode(this.props.node);
    } else if(evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      evt.preventDefault();

      ctx.createChildNode(ctx.parent(this.props.node));
    } else if(evt.ctrlKey) {
      if(evt.code === 'Delete') {
        evt.preventDefault();
        ctx.removeNode(this.props.node); 
      } else if(evt.code === 'ArrowLeft' || evt.code === 'Numpad4') {
        ctx.moveToLeftNode(this.props.node);
      } else if(evt.code === 'ArrowRight' || evt.code === 'Numpad6') {
        ctx.moveToRightNode(this.props.node);
      } else if(evt.code === 'ArrowUp' || evt.code === 'Numpad8') {
        ctx.moveToUpNode(this.props.node);
      } else if(evt.code === 'ArrowDown' || evt.code === 'Numpad2') {
        ctx.moveToDownNode(this.props.node);
      }
    } else if(evt.shiftKey) {
      if(evt.code === 'KeyD') {
        this.childrenCollapsed = !this.childrenCollapsed;

        evt.preventDefault();
        ctx.setChildNodesCollapsed?.(this.props.node, this.childrenCollapsed);
      }
      else if(evt.code === 'KeyE') {
        evt.preventDefault();
        ctx.setNodeCollapsed(this.props.node, !this.state.collapsed);
      }
    }    
  }

  render() {
    return (
      <li>
        <article
          ref={this.articleRef}
          className={classNames({
            collapsed: this.state.collapsed, 
            editable: true, 
            active: this.state.active
          })}
          tabIndex={this.props.tabIndex}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={this.onNodeInput}
          onClick={this.onNodeClicked}
          onKeyDown={this.onNodeKeyPressed}
        />
        { !this.state.collapsed && this.state.children.length 
          ? <ul>
              { this.state.children.map((child, index) => <Node 
                  key={child.id}
                  node={child}
                  tabIndex={index}
                />) }
            </ul> 
          : null }
      </li>
    );
  }
}
