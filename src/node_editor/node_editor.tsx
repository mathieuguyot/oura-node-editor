import React, { Component, RefObject } from "react";
import produce from "immer";

import { NodeModel, ConnectorType, XYPosition, LinkModel } from "./model";
import { Node } from "./node";
import PanZoom from "./pan_zoom";
import createLinkComponent from "./links";

type NodeEditorState = {
    nodes: { [nId: string]: NodeModel };
    links: Array<LinkModel>;
    isNodeBeingMoved: boolean;
    draggedLink?: LinkModel;
    zoom: number;
    selectedNodeId?: number;
};

function createRandomNodeModel(): { [nId: string]: NodeModel } {
    const nodes: { [nId: string]: NodeModel } = {};
    for (let index = 0; index < 1000; index += 1) {
        nodes[index.toString()] = {
            nId: index,
            name: `node_${index}`,
            width: Math.floor(Math.random() * 300) + 200,
            x: Math.floor(Math.random() * 5000),
            y: Math.floor(Math.random() * 5000),
            connectors: [
                { id: 0, name: "x", connectorType: ConnectorType.Input },
                { id: 1, name: "y", connectorType: ConnectorType.Input, contentType: "string" },
                { id: 2, name: "z", connectorType: ConnectorType.Input },
                { id: 4, name: "sum", connectorType: ConnectorType.Output },
                { id: 5, name: "product", connectorType: ConnectorType.Output }
            ]
        };
    }
    return nodes;
}

class NodeEditor extends Component<unknown, NodeEditorState> {
    private nodesRefs: { [nodeId: string]: RefObject<Node> } = {};

    constructor(props: unknown) {
        super(props);
        this.state = {
            zoom: 1,
            isNodeBeingMoved: false,
            nodes: createRandomNodeModel(),
            links: []
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

    componentDidMount(): void {
        const { links } = this.state;
        const newLinks = produce(links, (draft) => {
            draft.forEach((draftLink) => {
                if (!draftLink.inputPinPosition && !draftLink.outputPinPosition) {
                    const inputNode = this.nodesRefs[draftLink.inputNodeId].current;
                    const outputNode = this.nodesRefs[draftLink.outputNodeId].current;
                    if (inputNode && outputNode) {
                        const inputPinPosition = inputNode.getConnectorPinPosition(
                            draftLink.inputPinId
                        );
                        const outputPinPosition = outputNode.getConnectorPinPosition(
                            draftLink.outputPinId
                        );
                        if (inputPinPosition && outputPinPosition) {
                            draftLink.inputPinPosition = inputPinPosition;
                            draftLink.outputPinPosition = outputPinPosition;
                        }
                    }
                }
            });
        });
        this.setState({
            links: newLinks
        });
    }

    onNodeMoveStart(nId: number): void {
        this.setState({
            isNodeBeingMoved: true,
            selectedNodeId: nId
        });
    }

    onNodeMove(nId: number, offsetX: number, offsetY: number, offsetWidth: number): void {
        const { nodes } = this.state;
        const newNodes = produce(nodes, (draft) => {
            const newWidth = nodes[nId].width + offsetWidth;
            draft[nId] = {
                ...draft[nId],
                x: draft[nId].x + offsetX,
                y: draft[nId].y + offsetY,
                width: newWidth > 100 ? newWidth : 100
            };
        });

        this.setState({
            nodes: newNodes
        });

        const { links } = this.state;
        const newLinks = produce(links, (draft) => {
            draft.forEach((draftLink) => {
                const node = this.nodesRefs[nId].current;
                if (node) {
                    if (draftLink.inputNodeId === nId && draftLink.inputPinPosition) {
                        const position = node.getConnectorPinPosition(draftLink.inputPinId);
                        if (position) {
                            draftLink.inputPinPosition = { x: position.x, y: position.y };
                        }
                    }
                    if (draftLink.outputNodeId === nId && draftLink.outputPinPosition) {
                        const position = node.getConnectorPinPosition(draftLink.outputPinId);
                        if (position) {
                            draftLink.outputPinPosition = { x: position.x, y: position.y };
                        }
                    }
                }
            });
        });
        this.setState({
            links: newLinks
        });
    }

    onNodeMoveEnd(): void {
        this.setState({
            isNodeBeingMoved: false
        });
    }

    onWheelZoom(event: React.WheelEvent): void {
        const { isNodeBeingMoved, draggedLink, zoom } = this.state;
        if (!isNodeBeingMoved && !draggedLink) {
            const newZoom = event.deltaY > 0 ? zoom / 1.1 : zoom * 1.1;
            this.setState({
                zoom: newZoom
            });
        }
    }

    onUnselection(): void {
        this.setState({
            selectedNodeId: undefined
        });
    }

    onCreateLink(
        inputNodeId: number,
        inputConnectorId: number,
        outputNodeId: number,
        outputConnectorId: number
    ): void {
        const inputConnectorRef = this.nodesRefs[inputNodeId].current;
        const outputConnectorRef = this.nodesRefs[outputNodeId].current;
        if (inputConnectorRef && outputConnectorRef) {
            this.setState(
                produce((draft) => {
                    draft.links.push({
                        inputNodeId,
                        outputNodeId,
                        inputPinId: inputConnectorId,
                        outputPinId: outputConnectorId,
                        inputPinPosition: inputConnectorRef.getConnectorPinPosition(
                            inputConnectorId
                        ),
                        outputPinPosition: outputConnectorRef.getConnectorPinPosition(
                            outputConnectorId
                        )
                    });
                })
            );
        }
    }

    onUpdatePreviewLink(inputPosition: XYPosition | null, outputPosition: XYPosition | null): void {
        if (inputPosition === null || outputPosition === null) {
            this.setState({
                draggedLink: undefined
            });
        } else {
            this.setState({
                draggedLink: {
                    inputNodeId: -1,
                    outputNodeId: -1,
                    inputPinId: -1,
                    outputPinId: -1,
                    inputPinPosition: inputPosition,
                    outputPinPosition: outputPosition
                }
            });
        }
    }

    getZoom(): number {
        const { zoom } = this.state;
        return zoom;
    }

    createReferences(): void {
        const { nodes } = this.state;
        this.nodesRefs = {};
        Object.keys(nodes).forEach((key) => {
            this.nodesRefs[key] = React.createRef<Node>();
        });
    }

    render(): JSX.Element {
        const { nodes, links, draggedLink, zoom, selectedNodeId } = this.state;
        let svgDraggedLink;
        if (draggedLink) {
            svgDraggedLink = createLinkComponent({ link: draggedLink });
        }

        const svgLinks: JSX.Element[] = [];
        links.forEach((link, index) => {
            svgLinks.push(createLinkComponent({ link, key: index }));
        });
        const grid = String(300 * zoom);
        return (
            <div
                onWheel={this.onWheelZoom.bind(this)}
                style={{
                    position: "relative",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    backgroundColor: "#232323",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${grid}' height='${grid}' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='black' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}>
                <PanZoom zoom={zoom} onUnselection={this.onUnselection}>
                    <svg
                        style={{
                            position: "absolute",
                            top: "-1",
                            left: "-1",
                            width: "1",
                            height: "1",
                            overflow: "visible"
                        }}>
                        {svgLinks}
                        {svgDraggedLink}
                    </svg>
                    {Object.keys(nodes).map((key) => (
                        <Node
                            key={key}
                            ref={this.nodesRefs[key]}
                            node={nodes[key]}
                            isNodeSelected={nodes[key].nId === selectedNodeId}
                            getZoom={this.getZoom}
                            onNodeMoveStart={this.onNodeMoveStart}
                            onNodeMove={this.onNodeMove}
                            onNodeMoveEnd={this.onNodeMoveEnd}
                            onCreateLink={this.onCreateLink}
                            onUpdatePreviewLink={this.onUpdatePreviewLink}
                        />
                    ))}
                </PanZoom>
            </div>
        );
    }
}

export default NodeEditor;
