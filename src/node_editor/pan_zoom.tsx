/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { PanZoomModel, SelectionItem, XYPosition } from "./model";
import { useCallback, useState } from "react";
import { useDrag } from "./utils/drag";

export interface PanZoomInputProps {
    panZoomInfo: PanZoomModel;
    onPanZoomInfo: (panZoomInfo: PanZoomModel) => void;
    onSelectItem: (selection: SelectionItem | null, shiftKey: boolean) => void;
    onRectSelection: (topLeft: XYPosition, width: number, height: number) => void;
    children?: React.ReactNode;
}

// Can't use state for this are callbacks in TransformWrapper aren't updated :|
// Not that important since two node editor won't likelly be moved at the same time :)
let isMouseDownOnLinkCanvas: boolean = false;
let isMouseDownOnPanCanvas: boolean = false;
let panStartPosition: XYPosition | null = null;
let rectActivated = false;
let shiftKey = false;

interface SectionRectProps {
    rectStartPos: XYPosition;
    rectEndPos: XYPosition;
}

// GOOD TOP LEFT
// top: -rectStartPos.y / zoom,
// left: -rectStartPos.x / zoom,

function SelectionRect({ rectEndPos, rectStartPos }: SectionRectProps) {
    const width = rectEndPos.x - rectStartPos.x;
    const height = rectEndPos.y - rectStartPos.y;
    const minX = rectStartPos.x;
    const minY = rectStartPos.y;
    return (
        <div
            style={{
                position: "relative",
                width: width,
                height: height,
                top: minX,
                left: minY,
                border: "1px solid rgba(0,0,0,0.6)",
                backgroundColor: "rgba(0,0,0,0.4)"
            }}
        ></div>
    );
}

export default function PanZoom({
    panZoomInfo,
    onPanZoomInfo,
    onSelectItem,
    children,
    onRectSelection
}: PanZoomInputProps) {
    const [panDisabled, setPanDisabled] = useState(false);

    const [startRectPosition, setStartRectPosition] = useState<XYPosition | null>(null);
    const [currentRectPosition, setCurrentRectPosition] = useState<XYPosition | null>(null);

    const onMouseMoveCb = useCallback(
        (initialPos: XYPosition, finalPos: XYPosition) => {
            if (rectActivated) {
                setStartRectPosition({
                    x: initialPos.x - panZoomInfo.topLeftCorner.y / panZoomInfo.zoom,
                    y: initialPos.y - panZoomInfo.topLeftCorner.x / panZoomInfo.zoom
                });
                setCurrentRectPosition({
                    x: finalPos.x - panZoomInfo.topLeftCorner.y / panZoomInfo.zoom,
                    y: finalPos.y - panZoomInfo.topLeftCorner.x / panZoomInfo.zoom
                });
            }
        },
        [panZoomInfo]
    );

    const onMouseUpCb = useCallback(
        (_iPos: XYPosition, _fPos: XYPosition, mouseUpEvent: MouseEvent) => {},
        []
    );
    const drag = useDrag(
        () => {
            return panZoomInfo.zoom;
        },
        onMouseMoveCb,
        onMouseUpCb
    );

    const onMouseDown = useCallback(
        (e: React.MouseEvent) => {
            // Register shift key status
            shiftKey = e.shiftKey;

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
            setPanDisabled(
                e.altKey || e.button !== 0 || (!isMouseDownOnLinkCanvas && !isMouseDownOnPanCanvas)
            );
            if (e.altKey === true) {
                rectActivated = true;
                drag.onMouseDown(e, {
                    y: e.pageX / panZoomInfo.zoom,
                    x: e.pageY / panZoomInfo.zoom
                });
            }
        },
        [drag, panZoomInfo.zoom]
    );

    const onMouseUp = useCallback(
        (e: React.MouseEvent) => {
            shiftKey = e.shiftKey;
            if (rectActivated && startRectPosition && currentRectPosition) {
                const width = Math.abs(startRectPosition.x - currentRectPosition.x);
                const height = Math.abs(startRectPosition.y - currentRectPosition.y);
                onRectSelection(startRectPosition, width, height);
            }
            setStartRectPosition(null);
            setCurrentRectPosition(null);
            setPanDisabled(false);
        },
        [currentRectPosition, onRectSelection, startRectPosition]
    );

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
                !rectActivated &&
                (isMouseDownOnLinkCanvas || isMouseDownOnPanCanvas) &&
                panStartPosition &&
                panStartPosition.x === panEndPosition.x &&
                panStartPosition.y === panEndPosition.y
            ) {
                onSelectItem(null, shiftKey);
            }
            rectActivated = false;
            panStartPosition = null;
        },
        [onSelectItem]
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
            onMouseMove={(e) => {
                shiftKey = e.shiftKey;
            }}
            onMouseUp={onMouseUp}
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
                    <div style={{ height: "100vh", width: "100vw" }}>
                        {children}
                        {currentRectPosition && startRectPosition && (
                            <SelectionRect
                                rectEndPos={currentRectPosition}
                                rectStartPos={startRectPosition}
                            />
                        )}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}
