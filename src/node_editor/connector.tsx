import React, { Component } from "react";
import _ from "lodash";

import {
    ConnectorModel,
    PinLayout,
    XYPosition,
    NodeModel,
    LinkModel,
    PinSide,
    PinPosition
} from "./model";
import createConnectorComponent from "./connector_content";
import { DragWrapper } from "./events_wrappers";
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
    onUpdatePreviewLink?: (inputPos: PinPosition, outputPos: PinPosition) => void;
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
                onUpdatePreviewLink(initialPos, finalPos);
            };

            const onMouseUpCb = (iPos: XYPosition, fPos: XYPosition, targetClassName: string) => {
                const connectorRegex = /node-(.+)-connector-(.+)-(left|right)/;
                const tag = targetClassName.match(connectorRegex);
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
                onUpdatePreviewLink(null, null);
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
            x: pinSide === PinSide.RIGHT ? node.width + node.x : node.x,
            y: node.y + connectorRef.offsetTop + connectorRef.offsetHeight / 2
        };
    }

    render(): JSX.Element {
        const { connector, node, nodeId, cId } = this.props;

        return (
            <div
                ref={this.connectorRef}
                style={{
                    position: "relative",
                    paddingLeft: this.pinPxRadius * 2,
                    paddingRight: this.pinPxRadius * 2,
                    paddingTop: 3
                }}>
                {[PinLayout.LEFT_PIN, PinLayout.BOTH_PINS].includes(connector.pinLayout) && (
                    <Pin
                        className={`node-${nodeId}-connector-${cId}-left`}
                        pinPxRadius={this.pinPxRadius}
                        leftPinPosition={-this.pinPxRadius}
                        onMouseDown={(e) => this.onMouseDown(PinSide.LEFT, e)}
                    />
                )}

                {[PinLayout.RIGHT_PIN, PinLayout.BOTH_PINS].includes(connector.pinLayout) && (
                    <Pin
                        className={`node-${nodeId}-connector-${cId}-right`}
                        pinPxRadius={this.pinPxRadius}
                        leftPinPosition={node.width - this.pinPxRadius}
                        onMouseDown={(e) => this.onMouseDown(PinSide.RIGHT, e)}
                    />
                )}

                <div style={{ overflow: "hidden" }}>{createConnectorComponent(this.props)}</div>
            </div>
        );
    }
}

export default Connector;
