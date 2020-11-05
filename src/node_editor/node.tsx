import React, { Component, RefObject } from "react";
import * as _ from "lodash";
import CSS from "csstype";

import {
    LinkModel,
    NodeModel,
    PinType,
    XYPosition,
    arePositionEquals,
    ConnectorModel
} from "./model";
import Connector from "./connector";
import defaultStyles from "./default_styles";
import { DragWrapper } from "./events_wrappers";

export type NodeProps = {
    nodeId: string;
    node: NodeModel;
    isNodeSelected: boolean;

    getZoom: () => number;

    onNodeDeletion?(id: string): void;
    onNodeMoveStart?: (id: string) => void;
    onNodeMove?: (offsetX: number, offsetY: number, offsetWidth: number) => void;
    onNodeMoveEnd?: (ids: string, wasNodeMoved: boolean) => void;

    onConnectorUpdate: (nodeId: string, connectorId: string, connector: ConnectorModel) => void;
    onCreateLink?: (link: LinkModel) => void;
    onUpdatePreviewLink?: (
        inputPosition: XYPosition | null,
        outputPosition: XYPosition | null
    ) => void;
};

enum NodePart {
    Header,
    Core,
    Footer
}

export class Node extends Component<NodeProps> {
    private dragWrapper: DragWrapper = new DragWrapper();
    private connectorRefs: { [id: string]: RefObject<Connector> } = {};

    constructor(props: NodeProps) {
        super(props);
        this.createReferences();
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
        onNodeMoveStart(nodeId);

        const onMouseMoveCb = (iPos: XYPosition, finalPos: XYPosition, offsetPos: XYPosition) => {
            if (part === NodePart.Header || part === NodePart.Core) {
                onNodeMove(offsetPos.x, offsetPos.y, 0);
            } else {
                onNodeMove(0, 0, offsetPos.x);
            }
        };

        const onMouseUpCb = (initialPos: XYPosition, finalPos: XYPosition) => {
            onNodeMoveEnd(nodeId, !arePositionEquals(initialPos, finalPos));
        };

        const zoom = getZoom();
        const initialPos = { x: event.pageX / zoom, y: event.pageY / zoom };
        this.dragWrapper.onMouseDown(event, initialPos, getZoom, onMouseMoveCb, onMouseUpCb);
    }

    getConnectorPinPosition(connectorId: string, pinType: PinType): XYPosition | null {
        if (connectorId in this.connectorRefs) {
            const pin = this.connectorRefs[connectorId].current;
            if (pin) {
                return pin.getConnectorPinPosition(pinType);
            }
        }
        return null;
    }

    createReferences(): void {
        const { node } = this.props;
        this.connectorRefs = {};
        Object.keys(node.connectors).forEach((key) => {
            this.connectorRefs[key] = React.createRef<Connector>();
        });
    }

    render(): JSX.Element {
        const {
            nodeId,
            node,
            isNodeSelected,
            onCreateLink,
            onUpdatePreviewLink,
            getZoom,
            onNodeDeletion,
            onConnectorUpdate
        } = this.props;

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
                onMouseDown={this.onMouseDown.bind(this, NodePart.Core)}>
                <div
                    style={{ ...nodeHeaderStyle, ...defaultStyles.dark.nodeHeader }}
                    onMouseDown={this.onMouseDown.bind(this, NodePart.Header)}>
                    <div style={{ paddingLeft: "10px", paddingRight: "10px", overflow: "hidden" }}>
                        <div style={{ float: "left" }}>{node.name}</div>
                        <div
                            style={{ float: "right", cursor: "default" }}
                            onClick={() => {
                                if (onNodeDeletion) {
                                    onNodeDeletion(nodeId);
                                }
                            }}>
                            X
                        </div>
                    </div>
                </div>
                <div style={defaultStyles.dark.nodeBackground}>
                    {Object.keys(node.connectors).map((key) => {
                        const connector = node.connectors[key];
                        return (
                            <Connector
                                nodeId={nodeId}
                                connectorId={key}
                                getZoom={getZoom}
                                node={node}
                                key={key}
                                connector={connector}
                                ref={this.connectorRefs[key]}
                                onCreateLink={onCreateLink}
                                onUpdatePreviewLink={onUpdatePreviewLink}
                                onConnectorUpdate={onConnectorUpdate}
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
