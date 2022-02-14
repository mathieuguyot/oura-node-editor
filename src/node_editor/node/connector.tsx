import React, { Component } from "react";
import _ from "lodash";

import {
    ConnectorModel,
    PinLayout,
    XYPosition,
    NodeModel,
    LinkModel,
    PinSide,
    PinPosition,
    LinkPositionModel
} from "../model";
import { createConnectorComponent, ConnectorContentProps } from "../connector_content";
import DragWrapper from "../utils";
import Pin from "./pin";

type ConnectorProps = {
    nodeId: string;
    cId: string;
    node: NodeModel;
    connector: ConnectorModel;

    getZoom: () => number;
    onPinPositionUpdate: (cId: string, leftPinPos: PinPosition, rightPinPos: PinPosition) => void;
    onConnectorUpdate: (nodeId: string, cId: string, connector: ConnectorModel) => void;
    onCreateLink?: (link: LinkModel) => void;
    onUpdatePreviewLink?: (previewLink?: LinkPositionModel) => void;
    createCustomConnectorComponent?(props: ConnectorContentProps): JSX.Element | null;
};

class Connector extends Component<ConnectorProps> {
    private dragWrapper: DragWrapper = new DragWrapper();
    private connectorRef = React.createRef<HTMLDivElement>();

    private leftPinPos: PinPosition = null;
    private rightPinPos: PinPosition = null;

    private pinPxRadius = 7;

    constructor(props: ConnectorProps) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onPinPositionUpdate = this.onPinPositionUpdate.bind(this);
    }

    componentDidMount(): void {
        this.onPinPositionUpdate();
    }

    componentDidUpdate(): void {
        this.onPinPositionUpdate();
    }

    onPinPositionUpdate(): void {
        const { cId, onPinPositionUpdate } = this.props;
        const leftPinPos = this.getConnectorPinPosition(PinSide.LEFT);
        const rightPinPos = this.getConnectorPinPosition(PinSide.RIGHT);
        if (!_.isEqual(leftPinPos, this.leftPinPos) || !_.isEqual(rightPinPos, this.rightPinPos)) {
            this.leftPinPos = leftPinPos;
            this.leftPinPos = rightPinPos;
            onPinPositionUpdate(cId, leftPinPos, rightPinPos);
        }
    }

    onMouseDown(pinSide: PinSide, event: React.MouseEvent): void {
        const { nodeId, cId, getZoom, onUpdatePreviewLink, onCreateLink } = this.props;
        const pinPosition = this.getConnectorPinPosition(pinSide);
        if (pinPosition && onUpdatePreviewLink && onCreateLink) {
            const onMouseMoveCb = (initialPos: XYPosition, finalPos: XYPosition) => {
                onUpdatePreviewLink({
                    linkId: "preview",
                    outputPinPosition: finalPos,
                    inputPinPosition: initialPos
                });
            };

            const onMouseUpCb = (
                _iPos: XYPosition,
                _fPos: XYPosition,
                mouseUpEvent: MouseEvent
            ) => {
                const connectorRegex = /node-(.+)-connector-(.+)-(left|right)/;
                let tag: RegExpMatchArray | null = null;
                if (mouseUpEvent.target) {
                    const { className } = mouseUpEvent.target as Element;
                    if (typeof className === "string") {
                        tag = (mouseUpEvent.target as Element).className.match(connectorRegex);
                    }
                }
                if (tag !== null) {
                    onCreateLink({
                        inputNodeId: nodeId,
                        inputPinId: cId,
                        inputPinSide: pinSide === PinSide.LEFT ? PinSide.LEFT : PinSide.RIGHT,
                        outputNodeId: tag[1],
                        outputPinId: tag[2],
                        outputPinSide: tag[3] === "left" ? PinSide.LEFT : PinSide.RIGHT,
                        linkType: "bezier"
                    });
                }
                onUpdatePreviewLink(undefined);
            };

            this.dragWrapper.onMouseDown(event, pinPosition, getZoom, onMouseMoveCb, onMouseUpCb);
        }
    }

    getConnectorPinPosition(pinSide: PinSide): PinPosition {
        const { connector, node } = this.props;
        const connectorRef = this.connectorRef.current;
        if (
            !connectorRef ||
            connector.pinLayout === PinLayout.NO_PINS ||
            (pinSide === PinSide.LEFT && connector.pinLayout === PinLayout.RIGHT_PIN) ||
            (pinSide === PinSide.RIGHT && connector.pinLayout === PinLayout.LEFT_PIN)
        ) {
            return null;
        }

        return {
            x: pinSide === PinSide.RIGHT ? node.width + node.position.x : node.position.x,
            y: node.position.y + connectorRef.offsetTop + connectorRef.offsetHeight / 2
        };
    }

    render(): JSX.Element {
        const { connector, node, nodeId, cId, createCustomConnectorComponent } = this.props;

        // Connector content component creation follows two steps
        let connectorContent: JSX.Element | null = null;
        // 1. First, try to get custom provided connector content component
        if (createCustomConnectorComponent) {
            connectorContent = createCustomConnectorComponent(this.props);
        }
        // 2. If no specific component is provided by the customer, use lib ones
        if (!connectorContent) {
            connectorContent = createConnectorComponent(this.props);
        }

        return (
            <div
                className="node-background"
                ref={this.connectorRef}
                style={{
                    position: "relative",
                    paddingTop: 3
                }}
            >
                {[PinLayout.LEFT_PIN, PinLayout.BOTH_PINS].includes(connector.pinLayout) && (
                    <Pin
                        className={`node-${nodeId}-connector-${cId}-left`}
                        contentType={connector.contentType}
                        pinPxRadius={this.pinPxRadius}
                        leftPinPosition={-this.pinPxRadius}
                        onMouseDown={(e) => this.onMouseDown(PinSide.LEFT, e)}
                    />
                )}

                {[PinLayout.RIGHT_PIN, PinLayout.BOTH_PINS].includes(connector.pinLayout) && (
                    <Pin
                        className={`node-${nodeId}-connector-${cId}-right`}
                        contentType={connector.contentType}
                        pinPxRadius={this.pinPxRadius}
                        leftPinPosition={node.width - this.pinPxRadius}
                        onMouseDown={(e) => this.onMouseDown(PinSide.RIGHT, e)}
                    />
                )}

                <div
                    className="node-background"
                    style={{
                        overflow: "hidden",
                        paddingLeft: this.pinPxRadius * 2,
                        paddingRight: this.pinPxRadius * 2
                    }}
                >
                    {connectorContent}
                </div>
            </div>
        );
    }
}

export default Connector;
