/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { PanZoomModel, SelectionItem, XYPosition } from "./model";

export interface PanZoomInputProps {
    panZoomInfo: PanZoomModel;
    onPanZoomInfo: (panZoomInfo: PanZoomModel) => void;
    onSelectItem: (selection: SelectionItem | null, shiftKey: boolean) => void;
    children?: React.ReactNode;
}

export interface PanZoomInputState {
    panDisabled: boolean;
}

export default class PanZoom extends React.Component<PanZoomInputProps, PanZoomInputState> {
    private panStartPosition: XYPosition | null = null;
    private shiftKey = false;

    constructor(props: PanZoomInputProps) {
        super(props);
        this.state = {
            panDisabled: false
        };

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onZoomChange = this.onZoomChange.bind(this);
        this.onPanning = this.onPanning.bind(this);
        this.onPanningStart = this.onPanningStart.bind(this);
        this.onPanningStop = this.onPanningStop.bind(this);
    }

    onMouseDown(e: React.MouseEvent) {
        // Register shift key status
        this.shiftKey = e.shiftKey;

        const target = e.target as HTMLTextAreaElement;
        // Check if mouse button down was on link_canvas
        let mouseDownOnLinkCanvas = false;
        if (typeof target.id === "string") {
            mouseDownOnLinkCanvas = target.id === "link_canvas";
        }
        // Check if mouse button down was on react-zoom-pan-pinch canvas
        let mouseDownOnPanCanvas = false;
        if (typeof target.className === "string") {
            mouseDownOnPanCanvas = target.className.includes("react-transform-wrapper");
        }

        // Disable pad interactions if mouse ckick is not left was not on link or react-zoom-pan-pinch canvas
        this.setState({
            panDisabled: e.button !== 0 || (!mouseDownOnLinkCanvas && !mouseDownOnPanCanvas)
        });
    }

    onMouseUp() {
        this.setState({
            panDisabled: false
        });
    }

    onZoomChange(ref: any): void {
        const { onPanZoomInfo } = this.props;
        onPanZoomInfo({
            zoom: ref.state.scale,
            topLeftCorner: { x: ref.state.positionX, y: ref.state.positionY }
        });
    }

    onPanning(ref: any): void {
        const { onPanZoomInfo } = this.props;
        onPanZoomInfo({
            zoom: ref.state.scale,
            topLeftCorner: { x: ref.state.positionX, y: ref.state.positionY }
        });
    }

    onPanningStart(ref: any): void {
        this.panStartPosition = { x: ref.state.positionX, y: ref.state.positionY };
    }

    onPanningStop(ref: any): void {
        const { onSelectItem } = this.props;
        const panEndPosition = { x: ref.state.positionX, y: ref.state.positionY };
        if (
            this.panStartPosition &&
            this.panStartPosition.x === panEndPosition.x &&
            this.panStartPosition.y === panEndPosition.y
        ) {
            onSelectItem(null, this.shiftKey);
        }
    }

    render(): JSX.Element {
        const { panZoomInfo, children } = this.props;
        const { panDisabled } = this.state;

        return (
            <div
                id="panzoom"
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%"
                }}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
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
                    wheel={{
                        step: 0.1
                    }}
                    onWheel={this.onZoomChange}
                    onPanningStart={this.onPanningStart}
                    onPanning={this.onPanning}
                    onPanningStop={this.onPanningStop}
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
}
