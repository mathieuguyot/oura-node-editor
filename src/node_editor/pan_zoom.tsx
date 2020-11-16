/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { PanZoomModel } from "./model";

export interface PanZoomInputProps {
    panZoomInfo: PanZoomModel;
    onPanZoomInfo: (panZoomInfo: PanZoomModel) => void;
}

export default class PanZoom extends React.Component<PanZoomInputProps> {
    constructor(props: PanZoomInputProps) {
        super(props);

        this.onZoomChange = this.onZoomChange.bind(this);
        this.onPanning = this.onPanning.bind(this);
    }

    onZoomChange(e: any): void {
        const { onPanZoomInfo } = this.props;
        onPanZoomInfo({ zoom: e.scale, topLeftCorner: { x: e.positionX, y: e.positionY } });
    }

    onPanning(e: any): void {
        const { onPanZoomInfo } = this.props;
        onPanZoomInfo({ zoom: e.scale, topLeftCorner: { x: e.positionX, y: e.positionY } });
    }

    render(): JSX.Element {
        const { panZoomInfo, children } = this.props;
        return (
            <TransformWrapper
                options={{
                    limitToBounds: false,
                    minScale: 0.1,
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
                onPanning={this.onPanning}
                defaultScale={panZoomInfo.zoom}
                defaultPositionX={panZoomInfo.topLeftCorner.x}
                defaultPositionY={panZoomInfo.topLeftCorner.y}>
                <TransformComponent>
                    <div style={{ height: "100vh", width: "100vw" }}>{children}</div>
                </TransformComponent>
            </TransformWrapper>
        );
    }
}
