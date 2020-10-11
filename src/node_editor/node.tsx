import React, { Component, RefObject } from 'react';
import { NodeModel, ConnectorModel, XYPosition } from './model';
import Connector from './connector';
import * as _ from 'lodash';
import CSS from 'csstype';
import { default_styles } from './default_styles';

export type NodeProps = {
    node: NodeModel,
    isNodeSelected: boolean,

    getZoom: () => number,

    onNodeMoveStart: (nId: number) => void,
    onNodeMove: (nId: number, offsetX: number, offsetY: number, width: number) => void,
    onNodeMoveEnd: (nId: number) => void,

    onConnectorDragStart: (nId: number, connectorModel: ConnectorModel, draggedPinPosition: XYPosition) => void,
    onConnectorMouseMove: (draggedPinNewPosition: XYPosition) => void,
    onConnectorMouseUp: () => void,
    onMouseOverConnector: (nId: number, connectorModel: ConnectorModel, pinPosition: XYPosition) => void,
    onMouseLeavesConnector: (mousePosition: XYPosition) => void
}

enum NodePart {
    Header,
    Core,
    Footer,
}

export class Node extends Component<NodeProps, {}>  {
    private nodePart: NodePart = NodePart.Core;
    private pageX: number = 0;
    private pageY: number = 0;
    private connectorRefs: {[id: string] : RefObject<Connector>;} = {};


    constructor(props: NodeProps) {
        super(props);
    
        this.createReferences();

        this.onConnectorDragStart = this.onConnectorDragStart.bind(this);
        this.onConnectorMouseMove = this.onConnectorMouseMove.bind(this);
        this.onConnectorMouseUp = this.onConnectorMouseUp.bind(this);
        this.onMouseOverConnector = this.onMouseOverConnector.bind(this);
        this.onMouseLeavesConnector = this.onMouseLeavesConnector.bind(this);

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    shouldComponentUpdate(nextProps: NodeProps) {
        return !_.isEqual(this.props, nextProps); 
    }

    createReferences() {
        this.connectorRefs = {};
        this.props.node.connectors.forEach((connector) => {
            this.connectorRefs[connector.id] = React.createRef<Connector>();
        });
    }

    getConnectorPinPosition(id: number) : XYPosition | null {
        if(id in this.connectorRefs) {
            let pin = this.connectorRefs[id].current;
            if(pin) {
                return pin.getConnectorPinPosition();
            }
        }
        return null;
    }

    onMouseDown(part: NodePart, event: React.MouseEvent) {
        this.nodePart = part;
        event.stopPropagation();
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        const zoom = this.props.getZoom();
        this.pageX = event.pageX / zoom;
        this.pageY = event.pageY / zoom;
        this.props.onNodeMoveStart(this.props.node.nId);
    }

    onMouseMove(event: MouseEvent) {
        const node = this.props.node;
        const zoom = this.props.getZoom();
        let deltaX = event.pageX / zoom - this.pageX;
        let deltaY = event.pageY / zoom - this.pageY;
        this.pageX = event.pageX / zoom;
        this.pageY = event.pageY / zoom;
        if(this.nodePart === NodePart.Header || this.nodePart === NodePart.Core) {
            this.props.onNodeMove(node.nId, deltaX, deltaY, 0);
        } else {
            this.props.onNodeMove(node.nId, 0, 0, deltaX);
        }
    }

    onMouseUp() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        this.props.onNodeMoveEnd(this.props.node.nId);
    }

    onConnectorDragStart(connectorModel: ConnectorModel, draggedPinPosition: XYPosition) {
        this.props.onConnectorDragStart(this.props.node.nId, connectorModel, draggedPinPosition);
    }

    onConnectorMouseMove(draggedPinNewPosition: XYPosition) {
        this.props.onConnectorMouseMove(draggedPinNewPosition);
    }

    onConnectorMouseUp() {
        this.props.onConnectorMouseUp();
    }

    onMouseOverConnector(connectorModel: ConnectorModel, pinPosition: XYPosition) {
        this.props.onMouseOverConnector(this.props.node.nId, connectorModel, pinPosition);
    }

    onMouseLeavesConnector(mousePosition: XYPosition) {
        this.props.onMouseLeavesConnector(mousePosition);
    }

    render() {
        const {width, x, y, nId} = this.props.node;

        const node_core_style: CSS.Properties = {
            position:"absolute",
            width: width + "px",
            top: y + "px",
            left: x + "px"
        };

        const node_header_style: CSS.Properties = {
            position: "relative",
            MozUserSelect:"none",
            color:"white",
            width: width + "px",
        };

        const node_footer_style: CSS.Properties = {
            width: width +"px",
            position: "relative",
        };

        const node_core_selection_style = this.props.isNodeSelected ? default_styles.dark.node_selected : default_styles.dark.node_unselected;

        return (
                <div style={{...node_core_style, ...node_core_selection_style}}
                onMouseDown={this.onMouseDown.bind(this, NodePart.Core)}>
                    <div style={{...node_header_style, ...default_styles.dark.node_header}}
                        onMouseDown={this.onMouseDown.bind(this, NodePart.Header)}
                    >
                        <div style={{paddingLeft:"10px", overflow:"hidden"}}>
                            {this.props.node.name}
                        </div>
                    </div>
                    <div style={default_styles.dark.node_background}>
                        {this.props.node.connectors.map((connector) =>
                            <Connector 
                                getZoom={this.props.getZoom}
                                nodeId={nId}
                                nodeX={x}
                                nodeY={y}
                                key={connector.id} 
                                connectorModel={connector} 
                                width={width}
                                ref= {this.connectorRefs[connector.id]}

                                onConnectorDragStart={this.onConnectorDragStart}
                                onConnectorMouseMove={this.onConnectorMouseMove}
                                onConnectorMouseUp={this.onConnectorMouseUp}
                                onMouseOverConnector={this.onMouseOverConnector}
                                onMouseLeavesConnector={this.onMouseLeavesConnector}
                            />
                        )}
                    </div>
                    <div style={{...node_footer_style, ...default_styles.dark.node_footer}}
                        onMouseDown={this.onMouseDown.bind(this, NodePart.Footer)}
                    />
                </div>
        );
    }

}
