import React, { Component } from "react";
import * as _ from "lodash";
import CSS from "csstype";

import { ConnectorModel, ConnectorType, XYPosition } from "./model";
import createConnectorComponent from "./connector_content";
import defaultStyles from "./default_styles";
import DragWrapper from "./drag_wrapper";

type ConnectorProps = {
    nodeId: number;
    nodeX: number;
    nodeY: number;
    width: number;
    connectorModel: ConnectorModel;

    getZoom: () => number;

    onCreateLink: (
        inputNodeId: number,
        inputConnectorId: number,
        outputNodeId: number,
        outputConnectorId: number
    ) => void;
    onUpdatePreviewLink: (
        inputPosition: XYPosition | null,
        outputPosition: XYPosition | null
    ) => void;
};

class Connector extends Component<ConnectorProps> {
    private dragWrapper: DragWrapper = new DragWrapper();
    private connectorPinRef = React.createRef<HTMLDivElement>();
    private pinPxRadius = 7;

    constructor(props: ConnectorProps) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
    }

    shouldComponentUpdate(nextProps: ConnectorProps): boolean {
        return !_.isEqual(this.props, nextProps);
    }

    onMouseDown(event: React.MouseEvent): void {
        const pinPosition = this.getConnectorPinPosition();
        if (pinPosition) {
            const {
                nodeId,
                connectorModel,
                getZoom,
                onUpdatePreviewLink,
                onCreateLink
            } = this.props;
            const zoom = getZoom();
            this.dragWrapper.onMouseDown(
                event,
                pinPosition,
                zoom,
                (initialPos: XYPosition, finalPos: XYPosition) => {
                    onUpdatePreviewLink(initialPos, finalPos);
                },
                (initialPos: XYPosition, finalPos: XYPosition, targetClassName: string) => {
                    const connectorRegex = /node-(.+)-connector-(.+)-(input|output)/;
                    const tag = targetClassName.match(connectorRegex);
                    if (tag !== null) {
                        onCreateLink(nodeId, connectorModel.id, +tag[1], +tag[2]);
                    }
                    onUpdatePreviewLink(null, null);
                }
            );
        }
    }

    getConnectorPinPosition(): XYPosition | null {
        const pin = this.connectorPinRef.current;
        const parent = pin?.parentElement;
        if (pin && parent) {
            const { connectorModel, width, nodeX, nodeY } = this.props;
            const widthOffset = connectorModel.connectorType === ConnectorType.Output ? width : 0;
            return {
                x: nodeX + widthOffset,
                y: nodeY + parent.offsetTop + parent.offsetHeight / 2
            };
        }
        return null;
    }

    render(): JSX.Element {
        const { connectorModel, width, nodeId } = this.props;

        const pinLeftPos =
            connectorModel.connectorType === ConnectorType.Input
                ? -this.pinPxRadius
                : width - this.pinPxRadius;

        const connectorStyle: CSS.Properties = {
            position: "absolute",
            width: `${this.pinPxRadius * 2}px`,
            height: `${this.pinPxRadius * 2}px`,
            left: `${pinLeftPos}px`,
            top: `calc(50% - ${this.pinPxRadius}px)`
        };

        return (
            <div
                style={{
                    position: "relative",
                    paddingLeft: this.pinPxRadius * 2,
                    paddingRight: this.pinPxRadius * 2
                }}>
                <div
                    className={`node-${nodeId}-connector-${connectorModel.id}-input`}
                    style={{ ...connectorStyle, ...defaultStyles.dark.connector }}
                    ref={this.connectorPinRef}
                    onMouseDown={this.onMouseDown}
                />
                <div style={{ overflow: "hidden" }}>{createConnectorComponent(this.props)}</div>
            </div>
        );
    }
}

export default Connector;
