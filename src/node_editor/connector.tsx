import React, { Component } from "react";

import { ConnectorModel, PinLayout, XYPosition, NodeModel, LinkModel, PinSide } from "./model";
import createConnectorComponent from "./connector_content";
import { DragWrapper } from "./events_wrappers";
import Pin from "./pin";

type ConnectorProps = {
    nodeId: string;
    connectorId: string;
    node: NodeModel;
    connector: ConnectorModel;

    getZoom: () => number;
    onConnectorUpdate: (nodeId: string, connectorId: string, connector: ConnectorModel) => void;
    onCreateLink?: (link: LinkModel) => void;
    onUpdatePreviewLink?: (
        inputPosition: XYPosition | null,
        outputPosition: XYPosition | null
    ) => void;
};

class Connector extends Component<ConnectorProps> {
    private dragWrapper: DragWrapper = new DragWrapper();
    private connectorRef = React.createRef<HTMLDivElement>();
    private pinPxRadius = 7;

    constructor(props: ConnectorProps) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseDownLeftPin = this.onMouseDownLeftPin.bind(this);
        this.onMouseDownRightPin = this.onMouseDownRightPin.bind(this);
    }

    onMouseDown(pinSide: PinSide, event: React.MouseEvent): void {
        const { nodeId, connectorId, getZoom, onUpdatePreviewLink, onCreateLink } = this.props;
        const pinPosition = this.getConnectorPinPosition(pinSide);
        if (pinPosition && onUpdatePreviewLink && onCreateLink) {
            const onMouseMoveCb = (initialPos: XYPosition, finalPos: XYPosition) => {
                onUpdatePreviewLink(initialPos, finalPos);
            };

            const onMouseUpCb = (
                initialPos: XYPosition,
                finalPos: XYPosition,
                targetClassName: string
            ) => {
                const connectorRegex = /node-(.+)-connector-(.+)-(left|right)/;
                const tag = targetClassName.match(connectorRegex);
                if (tag !== null) {
                    onCreateLink({
                        inputNodeId: nodeId,
                        inputPinId: connectorId,
                        inputPinSide: pinSide === PinSide.LEFT ? PinSide.LEFT : PinSide.RIGHT,
                        outputNodeId: tag[1],
                        outputPinId: tag[2],
                        outputPinSide: tag[3] === "left" ? PinSide.LEFT : PinSide.RIGHT,
                        linkType: "bezier"
                    });
                }
                onUpdatePreviewLink(null, null);
            };

            this.dragWrapper.onMouseDown(event, pinPosition, getZoom, onMouseMoveCb, onMouseUpCb);
        }
    }

    onMouseDownLeftPin(event: React.MouseEvent): void {
        this.onMouseDown(PinSide.LEFT, event);
    }

    onMouseDownRightPin(event: React.MouseEvent): void {
        this.onMouseDown(PinSide.RIGHT, event);
    }

    getConnectorPinPosition(pinSide: PinSide): XYPosition | null {
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
            x: pinSide === PinSide.RIGHT ? node.width + node.x : node.x,
            y: node.y + connectorRef.offsetTop + connectorRef.offsetHeight / 2
        };
    }

    render(): JSX.Element {
        const { connector, node, nodeId, connectorId } = this.props;

        return (
            <div
                ref={this.connectorRef}
                style={{
                    position: "relative",
                    paddingLeft: this.pinPxRadius * 2,
                    paddingRight: this.pinPxRadius * 2,
                    paddingTop: 3
                }}>
                {(connector.pinLayout === PinLayout.LEFT_PIN ||
                    connector.pinLayout === PinLayout.BOTH_PINS) && (
                    <Pin
                        className={`node-${nodeId}-connector-${connectorId}-left`}
                        pinPxRadius={this.pinPxRadius}
                        leftPinPosition={-this.pinPxRadius}
                        onMouseDown={this.onMouseDownLeftPin}
                    />
                )}

                {(connector.pinLayout === PinLayout.RIGHT_PIN ||
                    connector.pinLayout === PinLayout.BOTH_PINS) && (
                    <Pin
                        className={`node-${nodeId}-connector-${connectorId}-right`}
                        pinPxRadius={this.pinPxRadius}
                        leftPinPosition={node.width - this.pinPxRadius}
                        onMouseDown={this.onMouseDownRightPin}
                    />
                )}

                <div style={{ overflow: "hidden" }}>{createConnectorComponent(this.props)}</div>
            </div>
        );
    }
}

export default Connector;
