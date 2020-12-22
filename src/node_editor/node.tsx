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
    PinPosition
} from "./model";
import Connector from "./connector";
import defaultStyles from "./default_styles";
import DragWrapper from "./events_wrappers";

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
    onUpdatePreviewLink?: (inputPos: PinPosition, outputPos: PinPosition) => void;
};

enum NodePart {
    Header,
    Core,
    Footer
}

export class Node extends Component<NodeProps> {
    private dragWrapper: DragWrapper = new DragWrapper();
    private pinPositions: NodePinPositions = {};

    constructor(props: NodeProps) {
        super(props);

        this.onPinPositionUpdate = this.onPinPositionUpdate.bind(this);
    }

    shouldComponentUpdate(nextProps: NodeProps): boolean {
        const { node, isNodeSelected } = this.props;
        return isNodeSelected !== nextProps.isNodeSelected || !_.isEqual(node, nextProps.node);
    }

    onMouseDown(part: NodePart, event: React.MouseEvent): void {
        const { nodeId, getZoom, onNodeMoveStart, onNodeMove, onNodeMoveEnd } = this.props;
        if (!onNodeMoveStart || !onNodeMove || !onNodeMoveEnd) {
            return;
        }
        onNodeMoveStart(nodeId, event.shiftKey);

        const onMouseMoveCb = (iPos: XYPosition, finalPos: XYPosition, offsetPos: XYPosition) => {
            if (part === NodePart.Header || part === NodePart.Core) {
                onNodeMove(offsetPos.x, offsetPos.y, 0);
            } else {
                onNodeMove(0, 0, offsetPos.x);
            }
        };

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
        const { nodeId, node, isNodeSelected } = this.props;
        const { onCreateLink, onUpdatePreviewLink, getZoom, onConnectorUpdate } = this.props;

        const nodeCoreStyle: CSS.Properties = {
            position: "absolute",
            width: `${node.width}px`,
            top: `${node.y}px`,
            left: `${node.x}px`
        };

        const nodeHeaderStyle: CSS.Properties = {
            position: "relative",
            MozUserSelect: "none",
            color: "white",
            width: `${node.width}px`
        };

        const nodeFooterStyle: CSS.Properties = {
            width: `${node.width}px`,
            position: "relative"
        };
        const nodeCoreSelectionStyle = isNodeSelected
            ? defaultStyles.dark.nodeSelected
            : defaultStyles.dark.nodeUnselected;
        return (
            <div
                style={{ ...nodeCoreStyle, ...nodeCoreSelectionStyle }}
                onMouseDown={this.onMouseDown.bind(this, NodePart.Core)}
                id={`node_${nodeId}`}>
                <div
                    style={{ ...nodeHeaderStyle, ...defaultStyles.dark.nodeHeader }}
                    onMouseDown={this.onMouseDown.bind(this, NodePart.Header)}>
                    <div style={{ paddingLeft: "10px", paddingRight: "10px", overflow: "hidden" }}>
                        {node.name}
                    </div>
                </div>
                <div style={defaultStyles.dark.nodeBackground}>
                    {Object.keys(node.connectors).map((key) => {
                        const connector = node.connectors[key];
                        return (
                            <Connector
                                nodeId={nodeId}
                                cId={key}
                                getZoom={getZoom}
                                node={node}
                                key={key}
                                connector={connector}
                                onCreateLink={onCreateLink}
                                onUpdatePreviewLink={onUpdatePreviewLink}
                                onConnectorUpdate={onConnectorUpdate}
                                onPinPositionUpdate={this.onPinPositionUpdate}
                            />
                        );
                    })}
                </div>
                <div
                    style={{ ...nodeFooterStyle, ...defaultStyles.dark.nodeFooter }}
                    onMouseDown={this.onMouseDown.bind(this, NodePart.Footer)}
                />
            </div>
        );
    }
}
