/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { PanZoomModel, SelectionItem, XYPosition } from "./model";
import { useCallback, useState } from "react";

export interface PanZoomInputProps {
    panZoomInfo: PanZoomModel;
    onPanZoomInfo: (panZoomInfo: PanZoomModel) => void;
    onSelectItem: (selection: SelectionItem | null, shiftKey: boolean) => void;
    children?: React.ReactNode;
}

// Can't use state for this are callbacks in TransformWrapper aren't updated :|
// Not that important since two node editor won't likelly be moved at the same time :)
let isMouseDownOnLinkCanvas: boolean = false;
let isMouseDownOnPanCanvas: boolean = false;
let panStartPosition: XYPosition | null = null;

export default function PanZoom({
    panZoomInfo,
    onPanZoomInfo,
    onSelectItem,
    children
}: PanZoomInputProps) {
    const [panDisabled, setPanDisabled] = useState(false);
    const [shiftKey, setShiftKey] = useState(false);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        // Register shift key status
        setShiftKey(e.shiftKey);

        const target = e.target as HTMLTextAreaElement;
        // Check if mouse button down was on link_canvas
        isMouseDownOnLinkCanvas = false;
        if (typeof target.id === "string") {
            isMouseDownOnLinkCanvas = target.id === "link_canvas";
        }
        // Check if mouse button down was on react-zoom-pan-pinch canvas
        isMouseDownOnPanCanvas = false;
        if (typeof target.className === "string") {
            isMouseDownOnPanCanvas = target.className.includes("react-transform-wrapper");
        }

        // Disable pad interactions if mouse ckick is not left was not on link or react-zoom-pan-pinch canvas
        setPanDisabled(e.button !== 0 || (!isMouseDownOnLinkCanvas && !isMouseDownOnPanCanvas));
    }, []);

    const onZoomChange = useCallback(
        (ref: any) => {
            onPanZoomInfo({
                zoom: ref.state.scale,
                topLeftCorner: { x: ref.state.positionX, y: ref.state.positionY }
            });
        },
        [onPanZoomInfo]
    );

    const onPanning = useCallback(
        (ref: any) => {
            onPanZoomInfo({
                zoom: ref.state.scale,
                topLeftCorner: { x: ref.state.positionX, y: ref.state.positionY }
            });
        },
        [onPanZoomInfo]
    );

    const onPanningStart = useCallback((ref: any) => {
        panStartPosition = { x: ref.state.positionX, y: ref.state.positionY };
    }, []);

    const onPanningStop = useCallback(
        (ref: any) => {
            const panEndPosition = { x: ref.state.positionX, y: ref.state.positionY };
            if (
                (isMouseDownOnLinkCanvas || isMouseDownOnPanCanvas) &&
                panStartPosition &&
                panStartPosition.x === panEndPosition.x &&
                panStartPosition.y === panEndPosition.y
            ) {
                onSelectItem(null, shiftKey);
            }
        },
        [onSelectItem, shiftKey]
    );

    return (
        <div
            id="panzoom"
            style={{
                position: "relative",
                width: "100%",
                height: "100%"
            }}
            onMouseDown={onMouseDown}
            onMouseUp={() => {
                setPanDisabled(false);
            }}
        >
            <TransformWrapper
                limitToBounds={false}
                minScale={0.35}
                panning={{
                    excluded: ["input", "select", "textarea", "button", "path"],
                    disabled: panDisabled,
                    velocityDisabled: true
                }}
                doubleClick={{
                    disabled: true
                }}
                onWheel={onZoomChange}
                onPanningStart={onPanningStart}
                onPanning={onPanning}
                onPanningStop={onPanningStop}
                initialScale={panZoomInfo.zoom}
                initialPositionX={panZoomInfo.topLeftCorner.x}
                initialPositionY={panZoomInfo.topLeftCorner.y}
            >
                <TransformComponent>
                    <div style={{ height: "100vh", width: "100vw" }}>{children}</div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}
