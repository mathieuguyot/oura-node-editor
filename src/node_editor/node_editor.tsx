import React, { Component, RefObject } from "react";
import {NodeModel, ConnectorType, XYPosition, LinkModel} from "./model";
import {Node} from "./node";
import PanZoom from "./pan_zoom";
import * as _ from "lodash";
import { createLinkComponent } from "./links";

type NodeEditorState = {
    nodes: {[nId: string] : NodeModel;}
    links: Array<LinkModel>;
    isNodeBeingMoved: boolean;
    draggedLink?: LinkModel;
    zoom: number;
    selectedNodeId?: number;
}

function dump_node_creator(): {[nId: string] : NodeModel;} {
    const nodes: {[nId: string] : NodeModel;} = {};
    for (let index = 0; index < 100; index++) {
        nodes[index.toString()] = {
            nId: index,
            name: "node_" + index,
            width: Math.floor(Math.random() * 300) + 200,
            x: Math.floor(Math.random() * 5000),
            y: Math.floor(Math.random() * 5000),
            connectors: [
                {id:0, name:"x", connectorType: ConnectorType.Input},
                {id:1, name:"y", connectorType: ConnectorType.Input, contentType: "string"},
                {id:2, name:"z", connectorType: ConnectorType.Input},
                {id:4, name:"sum", connectorType: ConnectorType.Output},
                {id:5, name:"product", connectorType: ConnectorType.Output},
            ]
        };
    }
    return nodes;
}

class NodeEditor extends Component<unknown, NodeEditorState>  {
    private nodesRefs: {[nodeId: string] : RefObject<Node>;} = {};

    constructor(props: unknown) {
        super(props);
        this.state = {
            zoom: 1,
            isNodeBeingMoved: false,
            nodes: dump_node_creator(),
            links: [],
        };

        this.createReferences();

        this.getZoom = this.getZoom.bind(this);

        this.onNodeMoveStart = this.onNodeMoveStart.bind(this);
        this.onNodeMove = this.onNodeMove.bind(this);
        this.onNodeMoveEnd = this.onNodeMoveEnd.bind(this);

        this.onUnselection = this.onUnselection.bind(this);

        this.onCreateLink = this.onCreateLink.bind(this);
        this.onUpdatePreviewLink = this.onUpdatePreviewLink.bind(this);
    }

    componentDidMount() : void {
        const newLinks = _.cloneDeep(this.state.links);
        for (const link of newLinks) {
            if(!link.inputPinPosition && !link.outputPinPosition) {
                const inputNode = this.nodesRefs[link.inputNodeId].current;
                const outputNode = this.nodesRefs[link.ouputNodeId].current;
                if(inputNode && outputNode) {
                    const inputPinPosition = inputNode.getConnectorPinPosition(link.inputPinId);
                    const outputPinPosition = outputNode.getConnectorPinPosition(link.outputPinId);
                    if(inputPinPosition && outputPinPosition) {
                        link.inputPinPosition = inputPinPosition;
                        link.outputPinPosition = outputPinPosition;
                    }
                }
            }
        }
        this.setState({
            links: newLinks
        });
    }
    
    createReferences() : void {
        this.nodesRefs = {};
        Object.keys(this.state.nodes).forEach((key) => {
            this.nodesRefs[key] = React.createRef<Node>();
        });
    }

    getZoom() : number
    {
        return this.state.zoom;
    }

    onNodeMoveStart(nId: number) : void {
        this.setState({
            isNodeBeingMoved: true,
            selectedNodeId: nId
        });
    }

    onNodeMove(nId: number, offsetX: number, offsetY: number, offsetWidth: number) : void {
        const newNode = _.cloneDeep(this.state.nodes);

        newNode[nId].x += offsetX;
        newNode[nId].y += offsetY;
        newNode[nId].width += offsetWidth;
        if(newNode[nId].width < 100)
        {
            newNode[nId].width = 100;
        }
        
        this.setState({
            nodes: newNode,
        });

        const newLinks =  _.cloneDeep(this.state.links);
        for (const link of newLinks) {
            const node = this.nodesRefs[nId].current;
            if(node)
            {
                if(link.inputNodeId === nId && link.inputPinPosition)
                {
                    const position = node.getConnectorPinPosition(link.inputPinId);
                    if(position)
                    {
                        link.inputPinPosition = {x: position.x, y: position.y};
                    }
                }
                if(link.ouputNodeId === nId && link.outputPinPosition)
                {
                    const position = node.getConnectorPinPosition(link.outputPinId);
                    if(position)
                    {
                        link.outputPinPosition = {x: position.x, y: position.y};
                    }
                }
            }
        }
        this.setState({
            links: newLinks
        });
    }

    onNodeMoveEnd() : void {
        this.setState({
            isNodeBeingMoved: false,
        });
    }

    onWheelZoom(event: React.WheelEvent) : void {
        if(!this.state.isNodeBeingMoved && !this.state.draggedLink)
        {
            if (event.deltaY > 0) {
                this.setState({
                    zoom: this.state.zoom / 1.1
                });
            }
            if (event.deltaY < 0) {
                this.setState({
                    zoom: this.state.zoom * 1.1
                });
            }
        }
    }

    onUnselection() : void {
        this.setState({
            selectedNodeId: undefined
        });
    }

    onCreateLink(inputNodeId: number, inputConnectorId: number, outputNodeId: number, outputConnectorId: number) : void {
        const inputConnectorRef = this.nodesRefs[inputNodeId].current;
        const outputConnectorRef = this.nodesRefs[outputNodeId].current;
        if(inputConnectorRef && outputConnectorRef) {
            const newLink: LinkModel = {
                inputNodeId: inputNodeId,
                ouputNodeId: outputNodeId,
                inputPinId: inputConnectorId,
                outputPinId: outputConnectorId,
                inputPinPosition: inputConnectorRef.getConnectorPinPosition(inputConnectorId),
                outputPinPosition: outputConnectorRef.getConnectorPinPosition(outputConnectorId)
            };
            const newLinks = _.cloneDeep(this.state.links);
            newLinks.push(newLink);
            this.setState({
                links: newLinks
            });
        }
    }

    onUpdatePreviewLink(inputPosition: XYPosition | null, outputPosition: XYPosition | null) : void
    {
        if(inputPosition === null || outputPosition === null)
        {
            this.setState({
                draggedLink: undefined
            });
            return;
        } else {
            const draggedLink: LinkModel = {
                inputNodeId: -1,
                ouputNodeId: -1,
                inputPinId: -1,
                outputPinId: -1,
                inputPinPosition: inputPosition,
                outputPinPosition: outputPosition
            };
            this.setState({
                draggedLink: draggedLink
            });
        }
    }

    render() : JSX.Element {
        const { nodes, links, draggedLink } = this.state;
        let svgDraggedLink;
        if(draggedLink) {
            svgDraggedLink = createLinkComponent({link: draggedLink});
        }

        const svgLinks: JSX.Element[] = [];
        let index = 1;
        for (const link of links) {
            svgLinks.push(createLinkComponent({link: link, key: index}));
            index++;
        }
        const grid = String(300 * this.state.zoom);
        return (
            <div onWheel={this.onWheelZoom.bind(this)}
                style={{position:"relative", top:"0", left:"0", width:"100%", height:"100%", overflow: "hidden",
                    backgroundColor: "#232323", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='"+ grid +"' height='" + grid + "' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='black' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}
            >
                <PanZoom zoom={this.state.zoom} onUnselection={this.onUnselection}>
                    <svg style={{position:"absolute", top:"-1", left:"-1", width:"1", height:"1", overflow:"visible"}}>
                        {svgLinks}
                        {svgDraggedLink}
                    </svg>
                    {
                        Object.keys(nodes).map((key) => (
                            <Node
                                key={key}
                                ref={this.nodesRefs[key]}

                                node={this.state.nodes[key]}
                                isNodeSelected={this.state.nodes[key].nId === this.state.selectedNodeId}

                                getZoom={this.getZoom}

                                onNodeMoveStart={this.onNodeMoveStart}
                                onNodeMove={this.onNodeMove}
                                onNodeMoveEnd={this.onNodeMoveEnd}

                                onCreateLink={this.onCreateLink}
                                onUpdatePreviewLink={this.onUpdatePreviewLink}
                            />
                        ))
                    }
                </PanZoom>
            </div>
        );
    }

}

export default NodeEditor;
