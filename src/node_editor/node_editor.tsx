import React, { Component, RefObject } from "react";
import { produce, enableMapSet } from "immer";

import {
    NodeModel,
    XYPosition,
    LinkModel,
    LinkPositionModel,
    arePositionEquals,
    PanZoomModel,
    ConnectorModel
} from "./model";
import { Node } from "./node";
import PanZoom from "./pan_zoom";
import createLinkComponent from "./links";
import { KeyPressedWrapper } from "./events_wrappers";

enableMapSet();

type NodeEditorProps = {
    nodes: { [id: string]: NodeModel };
    links: { [id: string]: LinkModel };
    panZoomInfo: PanZoomModel;

    onNodeMove(id: string, offsetX: number, offsetY: number, offsetWidth: number): void;
    onNodeDeletion?(id: string): void;
    onCreateLink(link: LinkModel): void;
    onConnectorUpdate?: (nodeId: string, connectorId: string, connector: ConnectorModel) => void;
    setPanZoomInfo: (panZoomInfo: PanZoomModel) => void;
};

type NodeEditorState = {
    linksPositions: { [linkId: string]: LinkPositionModel };
    isNodeBeingMoved: boolean;
    draggedLink?: LinkPositionModel;
    selectedNodesIds: Set<string>;
};

class NodeEditor extends Component<NodeEditorProps, NodeEditorState> {
    private nodesRefs: { [nodeId: string]: RefObject<Node> } = {};
    private keyPressedWrapper: KeyPressedWrapper = new KeyPressedWrapper();

    constructor(props: NodeEditorProps) {
        super(props);
        this.state = {
            isNodeBeingMoved: false,
            linksPositions: {},
            selectedNodesIds: new Set()
        };

        this.createNodeReferences();

        this.onNodeDeletion = this.onNodeDeletion.bind(this);
        this.getZoom = this.getZoom.bind(this);

        this.onNodeMoveStart = this.onNodeMoveStart.bind(this);
        this.onNodeMove = this.onNodeMove.bind(this);
        this.onNodeMoveEnd = this.onNodeMoveEnd.bind(this);

        this.onUpdatePreviewLink = this.onUpdatePreviewLink.bind(this);
        this.onCreateLink = this.onCreateLink.bind(this);
        this.onConnectorUpdate = this.onConnectorUpdate.bind(this);
    }

    componentDidMount(): void {
        this.keyPressedWrapper.attachListeners();
        const { links } = this.props;
        const { linksPositions } = this.state;
        const newLinksPositions = produce(linksPositions, (draft) => {
            Object.keys(links).forEach((key) => {
                const link = links[key];
                const inputNodeRef = this.nodesRefs[link.inputNodeId].current;
                const outputNodeRef = this.nodesRefs[link.outputNodeId].current;
                if (inputNodeRef && outputNodeRef) {
                    const inputPinPosition = inputNodeRef.getConnectorPinPosition(
                        link.inputPinId,
                        link.inputPinType
                    );
                    const outputPinPosition = outputNodeRef.getConnectorPinPosition(
                        link.outputPinId,
                        link.outputPinType
                    );
                    if (inputPinPosition && outputPinPosition) {
                        draft[key] = { linkId: key, inputPinPosition, outputPinPosition };
                    }
                }
            });
        });
        this.setState({
            linksPositions: newLinksPositions
        });
    }

    componentDidUpdate(): void {
        this.createNodeReferences();
        const { links } = this.props;
        const { linksPositions } = this.state;
        let updatedIsNeeded = false;
        const newLinksPositions = produce(linksPositions, (draft) => {
            Object.keys(links).forEach((key) => {
                const link = links[key];
                const inputNodeRef = this.nodesRefs[link.inputNodeId].current;
                const outputNodeRef = this.nodesRefs[link.outputNodeId].current;
                if (inputNodeRef && outputNodeRef) {
                    const inputPinPosition = inputNodeRef.getConnectorPinPosition(
                        link.inputPinId,
                        link.inputPinType
                    );
                    const outputPinPosition = outputNodeRef.getConnectorPinPosition(
                        link.outputPinId,
                        link.outputPinType
                    );
                    if (inputPinPosition && outputPinPosition) {
                        if (
                            !(key in draft) ||
                            !arePositionEquals(draft[key].inputPinPosition, inputPinPosition) ||
                            !arePositionEquals(draft[key].outputPinPosition, outputPinPosition)
                        ) {
                            draft[key] = { linkId: key, inputPinPosition, outputPinPosition };
                            updatedIsNeeded = true;
                        }
                    }
                }
            });
            Object.keys(linksPositions).forEach((key) => {
                if (!(key in links)) {
                    delete draft[key];
                    updatedIsNeeded = true;
                }
            });
        });
        if (updatedIsNeeded) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                linksPositions: newLinksPositions
            });
        }
    }

    componentWillUnmount(): void {
        this.keyPressedWrapper.detachListeners();
    }

    onNodeMoveStart(id: string): void {
        this.setState(
            produce((draftState: NodeEditorState) => {
                draftState.isNodeBeingMoved = true;
                if (
                    !this.keyPressedWrapper.isKeyDown("shift") &&
                    !draftState.selectedNodesIds.has(id)
                ) {
                    draftState.selectedNodesIds.clear();
                }
                draftState.selectedNodesIds.add(id);
            })
        );
    }

    onNodeMove(offsetX: number, offsetY: number, offsetWidth: number): void {
        const { selectedNodesIds } = this.state;

        selectedNodesIds.forEach((id) => {
            const { nodes, onNodeMove } = this.props;
            const newX = nodes[id].x + offsetX;
            const newY = nodes[id].y + offsetY;
            const newWidth = nodes[id].width + offsetWidth;
            onNodeMove(id, newX, newY, newWidth > 100 ? newWidth : 100);
        });
    }

    onNodeMoveEnd(id: string, wasNodeMoved: boolean): void {
        this.setState(
            produce((draftState: NodeEditorState) => {
                draftState.isNodeBeingMoved = false;
                if (!wasNodeMoved && !this.keyPressedWrapper.isKeyDown("shift")) {
                    draftState.selectedNodesIds.clear();
                    draftState.selectedNodesIds.add(id);
                }
            })
        );
    }

    onWheelZoom(event: React.WheelEvent): void {
        const { panZoomInfo, setPanZoomInfo } = this.props;
        const { isNodeBeingMoved, draggedLink } = this.state;
        if (!isNodeBeingMoved && !draggedLink) {
            const newPanZoomInfo = { ...panZoomInfo };
            newPanZoomInfo.zoom =
                event.deltaY > 0 ? panZoomInfo.zoom / 1.1 : panZoomInfo.zoom * 1.1;
            setPanZoomInfo(newPanZoomInfo);
        }
    }

    onUpdatePreviewLink(
        inputPinPosition: XYPosition | null,
        outputPinPosition: XYPosition | null
    ): void {
        if (inputPinPosition === null || outputPinPosition === null) {
            this.setState({
                draggedLink: undefined
            });
        } else {
            this.setState({
                draggedLink: {
                    linkId: "preview",
                    inputPinPosition,
                    outputPinPosition
                }
            });
        }
    }

    onCreateLink(link: LinkModel): void {
        const { onCreateLink } = this.props;
        if (link.inputPinType === link.outputPinType || link.inputNodeId === link.outputNodeId) {
            return;
        }
        onCreateLink(link);
    }

    onNodeDeletion(id: string): void {
        const { onNodeDeletion } = this.props;
        if (onNodeDeletion) {
            onNodeDeletion(id);
        }
    }

    onConnectorUpdate(nodeId: string, connectorId: string, connector: ConnectorModel): void {
        const { onConnectorUpdate } = this.props;
        if (onConnectorUpdate) {
            onConnectorUpdate(nodeId, connectorId, connector);
        }
    }

    getZoom(): number {
        const { panZoomInfo } = this.props;
        return panZoomInfo.zoom;
    }

    createNodeReferences(): void {
        const { nodes } = this.props;
        Object.keys(nodes).forEach((key) => {
            if (!(key in this.nodesRefs)) {
                this.nodesRefs[key] = React.createRef<Node>();
            }
        });
    }

    render(): JSX.Element {
        const { nodes, links, panZoomInfo, setPanZoomInfo } = this.props;
        const { draggedLink, selectedNodesIds, linksPositions } = this.state;
        let svgDraggedLink;
        if (draggedLink) {
            svgDraggedLink = createLinkComponent({ linkType: "bezier", linkPosition: draggedLink });
        }

        const svgLinks: JSX.Element[] = [];
        Object.keys(links).forEach((key) => {
            const linkPosition = linksPositions[key];
            if (linkPosition) {
                svgLinks.push(
                    createLinkComponent({
                        linkType: links[key].linkType,
                        key,
                        linkPosition
                    })
                );
            }
        });
        const grid = String(300 * panZoomInfo.zoom);
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
                <PanZoom panZoomInfo={panZoomInfo} setPanZoomInfo={setPanZoomInfo}>
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
                            nodeId={key}
                            key={key}
                            ref={this.nodesRefs[key]}
                            node={nodes[key]}
                            isNodeSelected={selectedNodesIds.has(key)}
                            getZoom={this.getZoom}
                            onNodeMoveStart={this.onNodeMoveStart}
                            onNodeMove={this.onNodeMove}
                            onNodeMoveEnd={this.onNodeMoveEnd}
                            onCreateLink={this.onCreateLink}
                            onUpdatePreviewLink={this.onUpdatePreviewLink}
                            onNodeDeletion={this.onNodeDeletion}
                            onConnectorUpdate={this.onConnectorUpdate}
                        />
                    ))}
                </PanZoom>
            </div>
        );
    }
}

export default NodeEditor;
