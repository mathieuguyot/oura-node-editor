import React, { Component, RefObject } from "react";
import { NodeModel, XYPosition } from "./model";
import Connector from "./connector";
import * as _ from "lodash";
import CSS from "csstype";
import { default_styles } from "./default_styles";
import DragWrapper from "./drag_wrapper";

export type NodeProps = {
    node: NodeModel,
    isNodeSelected: boolean,

    getZoom: () => number,

    onNodeMoveStart: (nId: number) => void,
    onNodeMove: (nId: number, offsetX: number, offsetY: number, width: number) => void,
    onNodeMoveEnd: (nId: number) => void,

    onCreateLink: (inputNodeId: number, inputConnectorId: number, outputNodeId: number, outputConnectorId: number) => void,
    onUpdatePreviewLink: (inputPosition: XYPosition | null, outputPosition: XYPosition | null) => void
}

enum NodePart {
    Header,
    Core,
    Footer,
}

export class Node extends Component<NodeProps>  {
    private dragWrapper: DragWrapper = new DragWrapper();
    private connectorRefs: {[id: string] : RefObject<Connector>;} = {};

    constructor(props: NodeProps) {
        super(props);
    
        this.createReferences();
    }

    shouldComponentUpdate(nextProps: NodeProps) : boolean {
        return !_.isEqual(this.props, nextProps); 
    }

    createReferences() : void {
        this.connectorRefs = {};
        this.props.node.connectors.forEach((connector) => {
            this.connectorRefs[connector.id] = React.createRef<Connector>();
        });
    }

    getConnectorPinPosition(id: number) : XYPosition | null {
        if(id in this.connectorRefs) {
            const pin = this.connectorRefs[id].current;
            if(pin) {
                return pin.getConnectorPinPosition();
            }
        }
        return null;
    }

    onMouseDown(part: NodePart, event: React.MouseEvent) : void {
        const node = this.props.node;
        const zoom = this.props.getZoom();
        const initialPos = {x: event.pageX / zoom, y: event.pageY / zoom};
        this.props.onNodeMoveStart(node.nId);
        this.dragWrapper.onMouseDown(event, initialPos, zoom, 
            (initialPos: XYPosition, finalPos: XYPosition, offsetPos: XYPosition) => {
                if(part === NodePart.Header || part === NodePart.Core) {
                    this.props.onNodeMove(node.nId, offsetPos.x, offsetPos.y, 0);
                } else {
                    this.props.onNodeMove(node.nId, 0, 0, offsetPos.x);
                }
            },
            () => {
                this.props.onNodeMoveEnd(node.nId);
            });
    }

    render() : JSX.Element {
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
                            onCreateLink={this.props.onCreateLink}
                            onUpdatePreviewLink={this.props.onUpdatePreviewLink}
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
