import React, { Component, RefObject } from 'react';
import {NodeModel, ConnectorType, ConnectorModel, XYPosition, LinkModel} from './model';
import {Node} from './node';
import Link from './link';
import PanZoom from './pan_zoom';
import * as _ from 'lodash';

type NodeEditorState = {
    nodes: {[nId: string] : NodeModel;}
    links: Array<LinkModel>;
    isNodeBeingMoved: boolean;
    draggedLink?: LinkModel;
    isDraggedLinkInput: boolean;
    outputLinkPosCandidate?: XYPosition;
    outputLinkNidCandidate?: number;
    outputLinkIdCandidate?: number;
    inputLinkPosCandidate?: XYPosition;
    inputLinkNidCandidate?: number;
    inputLinkIdCandidate?: number;
    zoom: number,
    selectedNodeId?: number;
}

function dump_node_creator(): {[nId: string] : NodeModel;} {
    let nodes: {[nId: string] : NodeModel;} = {};
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

class NodeEditor extends Component<{}, NodeEditorState>  {
    private nodesRefs: {[nodeId: string] : RefObject<Node>;} = {};

    constructor(props: {}) {
        super(props);
        this.state = {
            zoom: 1,
            isNodeBeingMoved: false,
            nodes: dump_node_creator(),
            links: [],
            isDraggedLinkInput: false,
        }

        this.createReferences();

        this.getZoom = this.getZoom.bind(this);

        this.onNodeMoveStart = this.onNodeMoveStart.bind(this);
        this.onNodeMove = this.onNodeMove.bind(this);
        this.onNodeMoveEnd = this.onNodeMoveEnd.bind(this);

        this.onConnectorDragStart = this.onConnectorDragStart.bind(this);
        this.onConnectorMouseMove = this.onConnectorMouseMove.bind(this);
        this.onConnectorMouseUp = this.onConnectorMouseUp.bind(this);
        this.onMouseOverConnector = this.onMouseOverConnector.bind(this);
        this.onMouseLeavesConnector = this.onMouseLeavesConnector.bind(this);

        this.onUnselection = this.onUnselection.bind(this);
    }

    shouldComponentUpdate() {
        //this.createReferences();
        return true;
    }

    componentDidMount() {
        let newLinks = _.cloneDeep(this.state.links);
        for (let link of newLinks) {
            if(!link.inputPinPosition && !link.outputPinPosition) {
                let inputNode = this.nodesRefs[link.inputNodeId].current;
                let outputNode = this.nodesRefs[link.ouputNodeId].current;
                if(inputNode && outputNode) {
                    let inputPinPosition = inputNode.getConnectorPinPosition(link.inputPinId);
                    let outputPinPosition = outputNode.getConnectorPinPosition(link.outputPinId);
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
    
    createReferences() {
        this.nodesRefs = {};
        Object.keys(this.state.nodes).forEach((key) => {
            this.nodesRefs[key] = React.createRef<Node>();
        });
    }

    getZoom()
    {
        return this.state.zoom;
    }

    onNodeMoveStart(nId: number) {
        this.setState({
            isNodeBeingMoved: true,
            selectedNodeId: nId
        });
    }

    onNodeMove(nId: number, offsetX: number, offsetY: number, offsetWidth: number) {
        let newNode = _.cloneDeep(this.state.nodes);
        let newLinks =  _.cloneDeep(this.state.links);

        newNode[nId].x += offsetX;
        newNode[nId].y += offsetY;

        if(newNode[nId].width + offsetWidth < 100) {
            offsetWidth = 100 - newNode[nId].width;
        }
        newNode[nId].width += offsetWidth;
        
        for (let link of newLinks) {
            let node = this.nodesRefs[nId].current;
            if(node)
            {
                if(link.inputNodeId === nId && link.inputPinPosition)
                {
                    let position = node.getConnectorPinPosition(link.inputPinId);
                    if(position)
                    {
                        link.inputPinPosition = {x: position.x + offsetX, y: position.y + offsetY};
                    }
                }
                if(link.ouputNodeId === nId && link.outputPinPosition)
                {
                    let position = node.getConnectorPinPosition(link.outputPinId);
                    if(position)
                    {
                        link.outputPinPosition = {x: position.x + offsetX + offsetWidth, y: position.y + offsetY};
                    }
                }
            }
        }
        this.setState({
            nodes: newNode,
            links: newLinks
        });
    }

    onNodeMoveEnd(nId: number) {
        this.setState({
            isNodeBeingMoved: false,
        });
    }

    onConnectorDragStart(nId: number, connectorModel: ConnectorModel, draggedPinPosition: XYPosition) {
        const id = connectorModel.id;
        if(connectorModel.connectorType === ConnectorType.Input)
        {
            // Init default dragged link
            let draggedLink: LinkModel = {inputNodeId: nId, inputPinId: id, inputPinPosition: _.cloneDeep(draggedPinPosition), 
                outputPinPosition: _.cloneDeep(draggedPinPosition), ouputNodeId: -1, outputPinId: -1};
            let isDraggedLinkInput = true;
            // Check if input is already linked
            let newLinks = _.cloneDeep(this.state.links);
            let index = 0;
            for(let link of newLinks) {
                if(link.inputNodeId === nId && link.inputPinId === id) {
                    newLinks.splice(index, 1);
                    break;
                }
                index++;
            }
            this.setState({
                draggedLink: draggedLink,
                isDraggedLinkInput: isDraggedLinkInput,
                links: newLinks,
                selectedNodeId: undefined
            });
        } else {
            let draggedLink: LinkModel = {inputNodeId: -1, inputPinId: -1, inputPinPosition: _.cloneDeep(draggedPinPosition), 
                outputPinPosition: _.cloneDeep(draggedPinPosition), ouputNodeId: nId, outputPinId: id};
            let isDraggedLinkInput = false;
            this.setState({
                draggedLink: draggedLink,
                isDraggedLinkInput: isDraggedLinkInput,
                selectedNodeId: undefined
            });
        }
    }

    onConnectorMouseMove(draggedPinNewPosition: XYPosition) {
        let draggedLink = _.cloneDeep(this.state.draggedLink);
        if(draggedLink && draggedLink.outputPinPosition && draggedLink.inputNodeId !== -1) {
            draggedLink.outputPinPosition.x += draggedPinNewPosition.x;
            draggedLink.outputPinPosition.y += draggedPinNewPosition.y;
            this.setState({
                draggedLink: draggedLink
            });
        } else if(draggedLink && draggedLink.inputPinPosition) {
            draggedLink.inputPinPosition.x += draggedPinNewPosition.x;
            draggedLink.inputPinPosition.y += draggedPinNewPosition.y;
            this.setState({
                draggedLink: draggedLink
            });
        }
    }

    onConnectorMouseUp()
    {
        let draggedLink = this.state.draggedLink;
        if(draggedLink && draggedLink.inputNodeId !== -1) {
            this.inputPinMouseUp()
        }
        else {
            this.outputPinMouseUp()
        }
    }

    inputPinMouseUp() {
        const {outputLinkPosCandidate, outputLinkNidCandidate, outputLinkIdCandidate} = this.state;

        if(outputLinkPosCandidate !== undefined && outputLinkNidCandidate !== undefined && outputLinkIdCandidate !== undefined) {
            let newLinks = _.cloneDeep(this.state.links);
            let newLink = this.state.draggedLink;
            if(newLink) {
                newLink.ouputNodeId = outputLinkNidCandidate;
                newLink.outputPinId = outputLinkIdCandidate;
                newLink.outputPinPosition = outputLinkPosCandidate;
                newLinks.push(newLink);

                this.setState({
                    draggedLink: undefined,
                    outputLinkPosCandidate: undefined,
                    outputLinkNidCandidate: undefined,
                    outputLinkIdCandidate: undefined,
                    links: newLinks
                });
                return;
            }
        } 
        this.setState({
            draggedLink: undefined,
            outputLinkPosCandidate: undefined,
            outputLinkNidCandidate: undefined,
            outputLinkIdCandidate: undefined
        });
    }

    outputPinMouseUp() {
        const {inputLinkPosCandidate, inputLinkNidCandidate, inputLinkIdCandidate} = this.state;
        if(inputLinkPosCandidate !== undefined && inputLinkNidCandidate !== undefined && inputLinkIdCandidate !== undefined) {
            let newLinks = _.cloneDeep(this.state.links);
            let newLink = this.state.draggedLink;
            if(newLink) {
                newLink.inputNodeId = inputLinkNidCandidate;
                newLink.inputPinId = inputLinkIdCandidate;
                newLink.inputPinPosition = inputLinkPosCandidate;
                let index = 0;
                for(let link of newLinks) {
                    if(newLink.inputNodeId === link.inputNodeId && newLink.inputPinId === link.inputPinId && 
                       newLink.ouputNodeId === link.ouputNodeId && newLink.outputPinId === link.outputPinId) 
                       {
                        this.setState({
                            draggedLink: undefined,
                            inputLinkPosCandidate: undefined,
                            inputLinkNidCandidate: undefined,
                            inputLinkIdCandidate: undefined
                        });
                        return;
                    }

                    if(newLink.inputNodeId === link.inputNodeId && newLink.inputPinId === link.inputPinId) {
                        newLinks.splice(index, 1);
                        break;
                    }
                    index++;
                }

                newLinks.push(newLink);

                this.setState({
                    draggedLink: undefined,
                    inputLinkPosCandidate: undefined,
                    inputLinkNidCandidate: undefined,
                    inputLinkIdCandidate: undefined,
                    links: newLinks
                });
                return;
            }
        } 
        this.setState({
            draggedLink: undefined,
            inputLinkPosCandidate: undefined,
            inputLinkNidCandidate: undefined,
            inputLinkIdCandidate: undefined
        });
    }

    onMouseOverConnector(nId: number, connectorModel: ConnectorModel, pinPosition: XYPosition) {
        if(connectorModel.connectorType === ConnectorType.Input)
        {
            if(this.state.draggedLink && !this.state.isDraggedLinkInput) {
                this.setState({
                    inputLinkPosCandidate: pinPosition,
                    inputLinkNidCandidate: nId,
                    inputLinkIdCandidate: connectorModel.id
                });
            }
        }
        else
        {
            if(this.state.draggedLink && this.state.isDraggedLinkInput) {
                this.setState({
                    outputLinkPosCandidate: pinPosition,
                    outputLinkIdCandidate: connectorModel.id,
                    outputLinkNidCandidate: nId
                });
            }
        }
    }

    onMouseLeavesConnector(mousePosition: XYPosition) {
        if(this.state.draggedLink && this.state.isDraggedLinkInput && this.state.outputLinkPosCandidate !== undefined) {
            this.setState({
                outputLinkPosCandidate: undefined,
                outputLinkIdCandidate: undefined,
                outputLinkNidCandidate: undefined
            });
        }
        if(this.state.draggedLink && !this.state.isDraggedLinkInput && this.state.inputLinkPosCandidate !== undefined) {
            this.setState({
                inputLinkPosCandidate: undefined,
                inputLinkNidCandidate: undefined,
                inputLinkIdCandidate: undefined
            });
        }
    }

    onWheelZoom(event: React.WheelEvent) {
        if(!this.state.isNodeBeingMoved && !this.state.draggedLink)
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

    onUnselection() {
        this.setState({
            selectedNodeId: undefined
        });
    }

    render() {
        const { nodes, links, draggedLink } = this.state;
        let svgDraggedLink;
        if(draggedLink) {
            svgDraggedLink = <Link link={draggedLink}/>
        }

        let svgLinks: JSX.Element[] = [];
        let index = 1;
        for (let link of links) {
            svgLinks.push(<Link key={index} link={link}/>);
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
                        Object.keys(nodes).map((key, index) => (
                            <Node
                                key={key}
                                ref={this.nodesRefs[key]}

                                node={this.state.nodes[key]}
                                isNodeSelected={this.state.nodes[key].nId === this.state.selectedNodeId}

                                getZoom={this.getZoom}

                                onNodeMoveStart={this.onNodeMoveStart}
                                onNodeMove={this.onNodeMove}
                                onNodeMoveEnd={this.onNodeMoveEnd}

                                onConnectorDragStart={this.onConnectorDragStart}
                                onConnectorMouseMove={this.onConnectorMouseMove}
                                onConnectorMouseUp={this.onConnectorMouseUp}
                                onMouseOverConnector={this.onMouseOverConnector}
                                onMouseLeavesConnector={this.onMouseLeavesConnector}
                            />
                        ))
                    }
                </PanZoom>
            </div>
        );
    }

}

export default NodeEditor;