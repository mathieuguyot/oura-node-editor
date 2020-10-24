import React, { Component, RefObject } from "react";
import * as _ from "lodash";
import CSS from "csstype";

import { LinkModel, NodeModel, PinType, XYPosition, arePositionEquals } from "./model";
import Connector from "./connector";
import defaultStyles from "./default_styles";
import DragWrapper from "./drag_wrapper";

export type NodeProps = {
    node: NodeModel;
    isNodeSelected: boolean;

    getZoom: () => number;

    onNodeMoveStart: (id: string) => void;
    onNodeMove: (offsetX: number, offsetY: number, offsetWidth: number) => void;
    onNodeMoveEnd: (id: string, wasNodeMoved: boolean) => void;

    onCreateLink: (link: LinkModel) => void;
    onUpdatePreviewLink: (
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
        const { node, getZoom, onNodeMoveStart, onNodeMove, onNodeMoveEnd } = this.props;
        onNodeMoveStart(node.id);

        const onMouseMoveCb = (iPos: XYPosition, finalPos: XYPosition, offsetPos: XYPosition) => {
            if (part === NodePart.Header || part === NodePart.Core) {
                onNodeMove(offsetPos.x, offsetPos.y, 0);
            } else {
                onNodeMove(0, 0, offsetPos.x);
            }
        };

        const onMouseUpCb = (initialPos: XYPosition, finalPos: XYPosition) => {
            onNodeMoveEnd(node.id, !arePositionEquals(initialPos, finalPos));
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
        node.connectors.forEach((connector) => {
            this.connectorRefs[connector.id] = React.createRef<Connector>();
        });
    }

    render(): JSX.Element {
        const { node, isNodeSelected, onCreateLink, onUpdatePreviewLink, getZoom } = this.props;

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
                    <div style={{ paddingLeft: "10px", overflow: "hidden" }}>{node.name}</div>
                </div>
                <div style={defaultStyles.dark.nodeBackground}>
                    {node.connectors.map((connector) => (
                        <Connector
                            getZoom={getZoom}
                            node={node}
                            key={connector.id}
                            connector={connector}
                            ref={this.connectorRefs[connector.id]}
                            onCreateLink={onCreateLink}
                            onUpdatePreviewLink={onUpdatePreviewLink}
                        />
                    ))}
                </div>
                <div
                    style={{ ...nodeFooterStyle, ...defaultStyles.dark.nodeFooter }}
                    onMouseDown={this.onMouseDown.bind(this, NodePart.Footer)}
                />
            </div>
        );
    }
}
