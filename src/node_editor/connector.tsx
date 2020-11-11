import React, { Component } from "react";
import * as _ from "lodash";
import CSS from "csstype";

import { ConnectorModel, PinLayout, XYPosition, NodeModel, LinkModel, PinSide } from "./model";
import createConnectorComponent from "./connector_content";
import defaultStyles from "./default_styles";
import { DragWrapper } from "./events_wrappers";

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

    shouldComponentUpdate(nextProps: ConnectorProps): boolean {
        return !_.isEqual(this.props, nextProps);
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

    renderPin(pinSide: PinSide, leftPinPosition: number): JSX.Element {
        const { connectorId, nodeId } = this.props;

        const connectorStyle: CSS.Properties = {
            position: "absolute",
            width: `${this.pinPxRadius * 2}px`,
            height: `${this.pinPxRadius * 2}px`,
            left: `${leftPinPosition}px`,
            top: `calc(50% - ${this.pinPxRadius}px)`
        };

        const direction = pinSide === PinSide.LEFT ? "left" : "right";

        return (
            <div
                className={`node-${nodeId}-connector-${connectorId}-${direction}`}
                style={{ ...connectorStyle, ...defaultStyles.dark.connector }}
                onMouseDown={this.onMouseDown.bind(this, pinSide)}
            />
        );
    }

    render(): JSX.Element {
        const { connector, node } = this.props;

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
                    connector.pinLayout === PinLayout.BOTH_PINS) &&
                    this.renderPin(PinSide.LEFT, -this.pinPxRadius)}

                {(connector.pinLayout === PinLayout.RIGHT_PIN ||
                    connector.pinLayout === PinLayout.BOTH_PINS) &&
                    this.renderPin(PinSide.RIGHT, node.width - this.pinPxRadius)}

                <div style={{ overflow: "hidden" }}>{createConnectorComponent(this.props)}</div>
            </div>
        );
    }
}

export default Connector;
