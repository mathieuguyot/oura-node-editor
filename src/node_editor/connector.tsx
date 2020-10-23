import React, { Component } from "react";
import * as _ from "lodash";
import CSS from "csstype";

import { ConnectorModel, PinLayout, XYPosition, NodeModel, LinkModel, PinType } from "./model";
import createConnectorComponent from "./connector_content";
import defaultStyles from "./default_styles";
import DragWrapper from "./drag_wrapper";

type ConnectorProps = {
    node: NodeModel;
    connector: ConnectorModel;

    getZoom: () => number;
    onCreateLink: (link: LinkModel) => void;
    onUpdatePreviewLink: (
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

    onMouseDown(pinType: PinType, event: React.MouseEvent): void {
        const pinPosition = this.getConnectorPinPosition(pinType);
        if (pinPosition) {
            const { node, connector, getZoom, onUpdatePreviewLink, onCreateLink } = this.props;

            const onMouseMoveCb = (initialPos: XYPosition, finalPos: XYPosition) => {
                onUpdatePreviewLink(initialPos, finalPos);
            };

            const onMouseUpCb = (targetClassName: string) => {
                const connectorRegex = /node-(.+)-connector-(.+)-(left|right)/;
                const tag = targetClassName.match(connectorRegex);
                if (tag !== null) {
                    onCreateLink({
                        inputNodeId: node.id,
                        inputPinId: connector.id,
                        inputPinType: pinType === PinType.LEFT ? PinType.LEFT : PinType.RIGHT,
                        outputNodeId: tag[1],
                        outputPinId: tag[2],
                        outputPinType: tag[3] === "left" ? PinType.LEFT : PinType.RIGHT
                    });
                }
                onUpdatePreviewLink(null, null);
            };

            this.dragWrapper.onMouseDown(event, pinPosition, getZoom, onMouseMoveCb, onMouseUpCb);
        }
    }

    getConnectorPinPosition(pinType: PinType): XYPosition | null {
        const { connector, node } = this.props;
        const pin = this.connectorRef.current;
        if (
            !pin ||
            connector.pinLayout === PinLayout.NO_PINS ||
            (pinType === PinType.LEFT && connector.pinLayout === PinLayout.RIGHT_PIN) ||
            (pinType === PinType.RIGHT && connector.pinLayout === PinLayout.LEFT_PIN)
        ) {
            return null;
        }

        return {
            x: pinType === PinType.RIGHT ? node.width + node.x : node.x,
            y: node.y + pin.offsetTop + pin.offsetHeight / 2
        };
    }

    renderPin(pinType: PinType, leftPinPosition: number): JSX.Element {
        const { connector, node } = this.props;

        const connectorStyle: CSS.Properties = {
            position: "absolute",
            width: `${this.pinPxRadius * 2}px`,
            height: `${this.pinPxRadius * 2}px`,
            left: `${leftPinPosition}px`,
            top: `calc(50% - ${this.pinPxRadius}px)`
        };

        const direction = pinType === PinType.LEFT ? "left" : "right";

        return (
            <div
                className={`node-${node.id}-connector-${connector.id}-${direction}`}
                style={{ ...connectorStyle, ...defaultStyles.dark.connector }}
                onMouseDown={this.onMouseDown.bind(this, pinType)}
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
                    paddingRight: this.pinPxRadius * 2
                }}>
                {(connector.pinLayout === PinLayout.LEFT_PIN ||
                    connector.pinLayout === PinLayout.BOTH_PINS) &&
                    this.renderPin(PinType.LEFT, -this.pinPxRadius)}

                {(connector.pinLayout === PinLayout.RIGHT_PIN ||
                    connector.pinLayout === PinLayout.BOTH_PINS) &&
                    this.renderPin(PinType.RIGHT, node.width - this.pinPxRadius)}

                <div style={{ overflow: "hidden" }}>{createConnectorComponent(this.props)}</div>
            </div>
        );
    }
}

export default Connector;
