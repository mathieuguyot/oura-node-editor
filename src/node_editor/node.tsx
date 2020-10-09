import React, { Component, RefObject } from 'react';
import { NodeModel, ConnectorModel, XYPosition } from './model';
import Connector from './connector';
import * as _ from 'lodash';

export type NodeProps = {
    node: NodeModel,

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

export class Node extends Component<NodeProps, {}>  {
    private isNodeDragged: boolean = false;
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

    onMouseDown(isNodeDragged: boolean, event: React.MouseEvent) {
        event.stopPropagation();
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        this.isNodeDragged = isNodeDragged;
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
        if(this.isNodeDragged) {
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
        return (
                <div style={{position:"absolute", width: width, top:y, left:x}}>
                    <div style={{
                        width: width,
                        height:"20px", 
                        backgroundColor:"rgba(48, 141, 97, 0.75)",
                        position: "relative",
                        borderRadius:"10px 10px 0px 0px",
                        cursor: "grab",
                        MozUserSelect:"none",
                        color:"white"
                        }}
                        onMouseDown={this.onMouseDown.bind(this, true)}
                    >
                        <p style={{paddingLeft:"10px", overflow:"hidden"}}>
                            {this.props.node.name}
                        </p>
                    </div>

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

                    <div style={{
                        width: width +"px", 
                        height:"10px", 
                        backgroundColor:"rgba(63, 63, 63, 0.75)",
                        position: "relative",
                        borderRadius:"0px 0px 10px 10px",
                        cursor: "ew-resize"
                        }}
                        onMouseDown={this.onMouseDown.bind(this, false)}
                    />
                </div>
        );
    }

}
