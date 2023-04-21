/* eslint-disable react/jsx-no-bind */
import React, { useCallback, useContext, useEffect, useState } from "react";
import CSS from "csstype";

import {
    LinkModel,
    NodeModel,
    XYPosition,
    arePositionEquals,
    ConnectorModel,
    NodePinPositions,
    PinPosition,
    LinkPositionModel
} from "../model";
import Connector from "./connector";
import Header from "./header";
import Footer from "./footer";
import { ThemeContext } from "../theme";
import { ConnectorContentProps } from "../connector_content";
import { PinLayout } from "..";
import produce from "immer";
import { useDrag } from "../utils/drag";

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
    onUpdatePreviewLink?: (previewLink?: LinkPositionModel) => void;

    createCustomConnectorComponent?(props: ConnectorContentProps): JSX.Element | null;
};

export function Node(props: NodeProps) {
    const {
        nodeId,
        node,
        isNodeSelected,
        getZoom,
        onNodePinPositionsUpdate,
        onNodeMoveStart,
        onNodeMove,
        onNodeMoveEnd,
        onConnectorUpdate,
        onCreateLink,
        onUpdatePreviewLink,
        createCustomConnectorComponent
    } = props;

    const [pinPositions, setPinPositions] = useState<NodePinPositions>({});
    const onPinPositionUpdate = useCallback(
        (cId: string, leftPinPos: PinPosition, rightPinPos: PinPosition) => {
            setPinPositions((pinPos) =>
                produce(pinPos, (draft) => {
                    draft[cId] = [leftPinPos, rightPinPos];
                })
            );
        },
        []
    );

    useEffect(() => {
        const connectableConnectorsLength = Object.keys(node.connectors).filter((name) => {
            return node.connectors[name].pinLayout !== PinLayout.NO_PINS;
        }).length;
        if (Object.keys(pinPositions).length === connectableConnectorsLength) {
            onNodePinPositionsUpdate(nodeId, pinPositions);
        }
    }, [node.connectors, nodeId, onNodePinPositionsUpdate, pinPositions]);

    const [className, setClassName] = useState<string>("");
    const onMouseMoveCb = useCallback(
        (_initialPos: XYPosition, _finalPos: XYPosition, offsetPos: XYPosition) => {
            if (onNodeMove && className.includes("node-footer")) {
                onNodeMove(0, 0, offsetPos.x);
            } else if (onNodeMove) {
                onNodeMove(offsetPos.x, offsetPos.y, 0);
            }
        },
        [className, onNodeMove]
    );

    const onMouseUpCb = useCallback(
        (iPos: XYPosition, fPos: XYPosition, mouseUpEv: MouseEvent) => {
            if (onNodeMoveEnd) {
                onNodeMoveEnd(nodeId, !arePositionEquals(iPos, fPos), mouseUpEv.shiftKey);
            }
        },
        [nodeId, onNodeMoveEnd]
    );

    const { onMouseDown } = useDrag(getZoom, onMouseMoveCb, onMouseUpCb);

    const localOnMouseDown = useCallback(
        (event: React.MouseEvent) => {
            if (!onNodeMoveStart || !onNodeMove || !onNodeMoveEnd) {
                return;
            }

            // Check if its the node that is targeted to be moved or something else
            // eg. node can be moved only if target element has node-background in is class name
            let stopEvent = true;
            if (event.target) {
                const { className } = event.target as Element;
                if (typeof className === "string" && className.includes("node-background")) {
                    setClassName(className);
                    stopEvent = false;
                }
            }
            if (stopEvent) {
                return;
            }
            const zoom = getZoom();
            const initialPos = { x: event.pageX / zoom, y: event.pageY / zoom };
            onNodeMoveStart(nodeId, event.shiftKey);
            onMouseDown(event, initialPos);
        },
        [getZoom, nodeId, onMouseDown, onNodeMove, onNodeMoveEnd, onNodeMoveStart]
    );

    const { theme } = useContext(ThemeContext);
    const nodeCoreSelectionStyle = isNodeSelected
        ? { ...theme?.node?.selected, ...node?.theme?.selected }
        : { ...theme?.node?.unselected, ...node?.theme?.unselected };

    const style: CSS.Properties = {
        position: "absolute",
        width: `${node.width}px`,
        top: `${node.position.y}px`,
        left: `${node.position.x}px`
    };

    return (
        <div
            className={"node-background"}
            style={{ ...style, ...nodeCoreSelectionStyle }}
            onMouseDown={localOnMouseDown}
            id={`node_${nodeId}`}
        >
            <Header node={node} />
            {/* Node body (list of connectors) */}
            <div className="bg-base-300" style={{ ...theme?.node?.body, ...node?.theme?.body }}>
                {Object.keys(node.connectors).map((key) => (
                    <Connector
                        nodeId={nodeId}
                        cId={key}
                        getZoom={getZoom}
                        node={node}
                        key={key}
                        connector={node.connectors[key]}
                        onCreateLink={onCreateLink}
                        onUpdatePreviewLink={onUpdatePreviewLink}
                        onConnectorUpdate={onConnectorUpdate}
                        onPinPositionUpdate={onPinPositionUpdate}
                        createCustomConnectorComponent={createCustomConnectorComponent}
                    />
                ))}
            </div>
            <Footer node={node} />
        </div>
    );
}
