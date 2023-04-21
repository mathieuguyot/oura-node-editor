import { useState, useCallback, useEffect, useRef } from "react";
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
import Pin from "./pin";
import { useDrag } from "../utils/drag";

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

const PIN_RADIUS_PX = 6;

export default function Connector(props: ConnectorProps) {
    const {
        nodeId,
        cId,
        node,
        connector,
        getZoom,
        onPinPositionUpdate,
        onCreateLink,
        onUpdatePreviewLink,
        createCustomConnectorComponent
    } = props;

    const [leftPinPos, setLeftPinPos] = useState<PinPosition | null>(null);
    const [rightPinPos, setRightPinPos] = useState<PinPosition | null>(null);
    const connectorRef = useRef<HTMLDivElement>(null);

    const getConnectorPinPosition = useCallback(
        (pinSide: PinSide) => {
            if (
                !connectorRef ||
                !connectorRef.current ||
                connector.pinLayout === PinLayout.NO_PINS ||
                (pinSide === PinSide.LEFT && connector.pinLayout === PinLayout.RIGHT_PIN) ||
                (pinSide === PinSide.RIGHT && connector.pinLayout === PinLayout.LEFT_PIN)
            ) {
                return null;
            }

            return {
                x: pinSide === PinSide.RIGHT ? node.width + node.position.x : node.position.x,
                y:
                    node.position.y +
                    connectorRef.current.offsetTop +
                    connectorRef.current.offsetHeight / 2
            };
        },
        [connector.pinLayout, node.position.x, node.position.y, node.width]
    );

    useEffect(() => {
        const newLeftPinPos = getConnectorPinPosition(PinSide.LEFT);
        const newRightPinPos = getConnectorPinPosition(PinSide.RIGHT);
        if (!_.isEqual(leftPinPos, newLeftPinPos) || !_.isEqual(rightPinPos, newRightPinPos)) {
            setLeftPinPos(newLeftPinPos);
            setRightPinPos(newRightPinPos);
            onPinPositionUpdate(cId, newLeftPinPos, newRightPinPos);
        }
    }, [cId, getConnectorPinPosition, leftPinPos, onPinPositionUpdate, rightPinPos]);

    // Connector content component creation follows two steps
    let connectorContent: JSX.Element | null = null;
    // 1. First, try to get custom provided connector content component
    if (createCustomConnectorComponent) {
        connectorContent = createCustomConnectorComponent(props);
    }
    // 2. If no specific component is provided by the customer, use lib ones
    if (!connectorContent) {
        connectorContent = createConnectorComponent(props);
    }

    const onMouseMoveCb = useCallback(
        (initialPos: XYPosition, finalPos: XYPosition) => {
            if (onUpdatePreviewLink)
                onUpdatePreviewLink({
                    linkId: "preview",
                    outputPinPosition: finalPos,
                    inputPinPosition: initialPos
                });
        },
        [onUpdatePreviewLink]
    );

    const onMouseUpCb = useCallback(
        (_iPos: XYPosition, _fPos: XYPosition, mouseUpEvent: MouseEvent) => {
            if (!onCreateLink || !onUpdatePreviewLink) {
                return;
            }
            const connectorRegex = /node-(.+)-connector-(.+)-(left|right)/;
            let tag: RegExpMatchArray | null = null;
            if (mouseUpEvent.target) {
                const { className } = mouseUpEvent.target as Element;
                if (typeof className === "string") {
                    tag = (mouseUpEvent.target as Element).className.match(connectorRegex);
                }
            }
            if (tag !== null && tag[3] === "left") {
                onCreateLink({
                    inputNodeId: tag[1],
                    inputPinId: tag[2],
                    inputPinSide: PinSide.LEFT,
                    outputNodeId: nodeId,
                    outputPinId: cId,
                    outputPinSide: PinSide.RIGHT
                });
            } else if (tag !== null) {
                onCreateLink({
                    inputNodeId: nodeId,
                    inputPinId: cId,
                    inputPinSide: PinSide.LEFT,
                    outputNodeId: tag[1],
                    outputPinId: tag[2],
                    outputPinSide: PinSide.RIGHT,
                    linkType: "bezier"
                });
            }
            onUpdatePreviewLink(undefined);
        },
        [cId, nodeId, onCreateLink, onUpdatePreviewLink]
    );

    const { onMouseDown } = useDrag(getZoom, onMouseMoveCb, onMouseUpCb);

    return (
        <div
            className="node-background"
            ref={connectorRef}
            style={{
                position: "relative"
            }}
        >
            {[PinLayout.LEFT_PIN, PinLayout.BOTH_PINS].includes(connector.pinLayout) && (
                <Pin
                    className={`node-${nodeId}-connector-${cId}-left`}
                    contentType={connector.contentType}
                    pinPxRadius={PIN_RADIUS_PX}
                    leftPinPosition={-PIN_RADIUS_PX}
                    onMouseDown={(e) => {
                        const pinPos = getConnectorPinPosition(PinSide.LEFT);
                        if (pinPos) onMouseDown(e, pinPos);
                    }}
                    pinColor={connector.leftPinColor}
                />
            )}

            {[PinLayout.RIGHT_PIN, PinLayout.BOTH_PINS].includes(connector.pinLayout) && (
                <Pin
                    className={`node-${nodeId}-connector-${cId}-right`}
                    contentType={connector.contentType}
                    pinPxRadius={PIN_RADIUS_PX}
                    leftPinPosition={node.width - PIN_RADIUS_PX}
                    onMouseDown={(e) => {
                        const pinPos = getConnectorPinPosition(PinSide.RIGHT);
                        if (pinPos) onMouseDown(e, pinPos);
                    }}
                    pinColor={connector.rightPinColor}
                />
            )}

            <div
                className="node-background"
                style={{
                    overflow: "hidden",
                    paddingLeft: PIN_RADIUS_PX * 2,
                    paddingRight: PIN_RADIUS_PX * 2
                }}
            >
                {connectorContent}
            </div>
        </div>
    );
}
