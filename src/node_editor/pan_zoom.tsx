/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import _ from "lodash";

import { PanZoomModel, SelectionItem, XYPosition } from "./model";

export interface PanZoomInputProps {
    panZoomInfo: PanZoomModel;
    onPanZoomInfo: (panZoomInfo: PanZoomModel) => void;
    onSelectItem: (selection: SelectionItem | null, shiftKey: boolean) => void;
}

export default class PanZoom extends React.Component<PanZoomInputProps> {
    private panStartPosition: XYPosition | null = null;
    private shiftKey = false;
    constructor(props: PanZoomInputProps) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onZoomChange = this.onZoomChange.bind(this);
        this.onPanning = this.onPanning.bind(this);
        this.onPanningStart = this.onPanningStart.bind(this);
        this.onPanningStop = this.onPanningStop.bind(this);
    }

    onMouseDown(e: React.MouseEvent) {
        this.shiftKey = e.shiftKey;
        if (e.button !== 0) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onZoomChange(e: any): void {
        const { onPanZoomInfo } = this.props;
        onPanZoomInfo({ zoom: e.scale, topLeftCorner: { x: e.positionX, y: e.positionY } });
    }

    onPanning(e: any): void {
        const { onPanZoomInfo } = this.props;
        onPanZoomInfo({ zoom: e.scale, topLeftCorner: { x: e.positionX, y: e.positionY } });
    }

    onPanningStart(e: any): void {
        this.panStartPosition = { x: e.positionX, y: e.positionY };
    }

    onPanningStop(e: any): void {
        const { onSelectItem } = this.props;
        const panEndPosition = { x: e.positionX, y: e.positionY };
        if (_.isEqual(this.panStartPosition, panEndPosition)) {
            onSelectItem(null, this.shiftKey);
        }
    }

    render(): JSX.Element {
        const { panZoomInfo, children } = this.props;
        return (
            <div
                id="panzoom"
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%"
                }}
                onMouseDown={this.onMouseDown}>
                <TransformWrapper
                    options={{
                        limitToBounds: false,
                        minScale: 0.35,
                        centerContent: false
                    }}
                    pan={{
                        velocity: false
                    }}
                    doubleClick={{
                        disabled: true
                    }}
                    wheel={{
                        step: 100
                    }}
                    onWheel={this.onZoomChange}
                    onPanningStart={this.onPanningStart}
                    onPanning={this.onPanning}
                    onPanningStop={this.onPanningStop}
                    defaultScale={panZoomInfo.zoom}
                    defaultPositionX={panZoomInfo.topLeftCorner.x}
                    defaultPositionY={panZoomInfo.topLeftCorner.y}>
                    <TransformComponent>
                        <div style={{ height: "100vh", width: "100vw" }}>{children}</div>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        );
    }
}
