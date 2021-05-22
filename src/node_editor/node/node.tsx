/* eslint-disable react/jsx-no-bind */
import React, { Component } from "react";
import _ from "lodash";
import CSS from "csstype";

import {
    LinkModel,
    NodeModel,
    XYPosition,
    arePositionEquals,
    ConnectorModel,
    NodePinPositions,
    PinPosition,
    LinkPositionModel
} from "../model";
import Connector from "./connector";
import DragWrapper from "../utils";
import Header from "./header";
import Footer from "./footer";
import { ThemeContext } from "../theme";
import { ConnectorContentProps } from "../connector_content";

export type NodeProps = {
    nodeId: string;
    node: NodeModel;
    isNodeSelected: boolean;

    getZoom: () => number;

    onNodePinPositionsUpdate: (nodeId: string, pinPositions: NodePinPositions) => void;

    onNodeMoveStart?: (id: string, shiftKey: boolean) => void;
    onNodeMove?: (offsetX: number, offsetY: number, offsetWidth: number) => void;
    onNodeMoveEnd?: (ids: string, wasNodeMoved: boolean, shiftKey: boolean) => void;

    onConnectorUpdate: (nodeId: string, cId: string, connector: ConnectorModel) => void;
    onCreateLink?: (link: LinkModel) => void;
    onUpdatePreviewLink?: (previewLink?: LinkPositionModel) => void;

    createCustomConnectorComponent?(props: ConnectorContentProps): JSX.Element | null;
};

export class Node extends Component<NodeProps> {
    private dragWrapper: DragWrapper = new DragWrapper();
    private pinPositions: NodePinPositions = {};

    constructor(props: NodeProps) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onPinPositionUpdate = this.onPinPositionUpdate.bind(this);
    }

    shouldComponentUpdate(nextProps: NodeProps): boolean {
        const { node, isNodeSelected } = this.props;
        return isNodeSelected !== nextProps.isNodeSelected || !_.isEqual(node, nextProps.node);
    }

    onMouseDown(event: React.MouseEvent): void {
        const { nodeId, getZoom, onNodeMoveStart, onNodeMove, onNodeMoveEnd } = this.props;
        if (!onNodeMoveStart || !onNodeMove || !onNodeMoveEnd) {
            return;
        }

        // Check if its the node that is targeted to be moved or something else
        // eg. node can be moved only if target element has node-background in is class name
        let stopEvent = true;
        let classNameStr = "";
        if (event.target) {
            const { className } = event.target as Element;
            if (typeof className === "string" && className.includes("node-background")) {
                classNameStr = className;
                stopEvent = false;
            }
        }
        if (stopEvent) {
            return;
        }

        // Node move management is performed following 3 steps
        // 1. When mouse button is pressed down, node move start callback is called
        onNodeMoveStart(nodeId, event.shiftKey);

        // 2. Every times the mouse is dragged, node position (if clicked on header or core)
        // or width (if clicked on footer) is updated using onNodeMove callback
        const onMouseMoveCb = (_iPos: XYPosition, _finalPos: XYPosition, offsetPos: XYPosition) => {
            if (classNameStr.includes("node-footer")) {
                onNodeMove(0, 0, offsetPos.x);
            } else {
                onNodeMove(offsetPos.x, offsetPos.y, 0);
            }
        };

        // 3. When mouse button is released, node move end callback is called
        const onMouseUpCb = (iPos: XYPosition, fPos: XYPosition, mouseUpEv: MouseEvent) => {
            onNodeMoveEnd(nodeId, !arePositionEquals(iPos, fPos), mouseUpEv.shiftKey);
        };

        const zoom = getZoom();
        const initialPos = { x: event.pageX / zoom, y: event.pageY / zoom };
        this.dragWrapper.onMouseDown(event, initialPos, getZoom, onMouseMoveCb, onMouseUpCb);
    }

    onPinPositionUpdate(cId: string, leftPinPos: PinPosition, rightPinPos: PinPosition): void {
        const { nodeId, node, onNodePinPositionsUpdate } = this.props;
        this.pinPositions[cId] = [leftPinPos, rightPinPos];
        if (Object.keys(this.pinPositions).length === Object.keys(node.connectors).length) {
            onNodePinPositionsUpdate(nodeId, this.pinPositions);
        }
    }

    render(): JSX.Element {
        const { theme } = this.context;
        const { nodeId, node, isNodeSelected } = this.props;
        const { onCreateLink, onUpdatePreviewLink, getZoom, onConnectorUpdate } = this.props;
        const { createCustomConnectorComponent } = this.props;

        const style: CSS.Properties = {
            position: "absolute",
            width: `${node.width}px`,
            top: `${node.position.y}px`,
            left: `${node.position.x}px`
        };

        const nodeCoreSelectionStyle = isNodeSelected
            ? theme?.node?.selected
            : theme?.node?.unselected;
        return (
            <div
                className="node-background"
                style={{ ...style, ...nodeCoreSelectionStyle }}
                onMouseDown={this.onMouseDown}
                id={`node_${nodeId}`}>
                <Header node={node} />
                {/* Node body (list of connectors) */}
                <div style={theme?.node?.body}>
                    {Object.keys(node.connectors).map((key) => (
                        <Connector
                            nodeId={nodeId}
                            cId={key}
                            getZoom={getZoom}
                            node={node}
                            key={key}
                            connector={node.connectors[key]}
                            onCreateLink={onCreateLink}
                            onUpdatePreviewLink={onUpdatePreviewLink}
                            onConnectorUpdate={onConnectorUpdate}
                            onPinPositionUpdate={this.onPinPositionUpdate}
                            createCustomConnectorComponent={createCustomConnectorComponent}
                        />
                    ))}
                </div>
                <Footer />
            </div>
        );
    }
}

Node.contextType = ThemeContext;
