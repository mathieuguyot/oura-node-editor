import * as React from "react";
import { DragWrapper } from "./events_wrappers";
import { XYPosition, PanZoomModel } from "./model";

export interface PanZoomInputState {
    matrixData: number[];
}

export interface PanZoomInputProps {
    panZoomInfo: PanZoomModel;
    setPanZoomInfo: (panZoomInfo: PanZoomModel) => void;
}

export default class PanZoom extends React.Component<PanZoomInputProps, PanZoomInputState> {
    // Used to set cursor while moving.
    private panWrapper: React.RefObject<HTMLDivElement> = React.createRef();
    private dragWrapper: DragWrapper = new DragWrapper();

    private onMouseDown = (e: React.MouseEvent) => {
        const getZoom = (): number => {
            const { panZoomInfo } = this.props;
            return panZoomInfo.zoom;
        };

        const onMouseMoveCb = (
            initialPos: XYPosition,
            finalPos: XYPosition,
            offSetPos: XYPosition
        ) => {
            const { panZoomInfo, setPanZoomInfo } = this.props;
            const newPanZoomInfo = { ...panZoomInfo };
            newPanZoomInfo.topLeftCorner = {
                x: panZoomInfo.topLeftCorner.x - offSetPos.x,
                y: panZoomInfo.topLeftCorner.y - offSetPos.y
            };
            setPanZoomInfo(newPanZoomInfo);
        };

        const onMouseUpCb = () => {
            if (this.panWrapper.current) {
                this.panWrapper.current.style.cursor = "";
            }
        };

        const initialPosition: XYPosition = { x: e.pageX, y: e.pageY };
        this.dragWrapper.onMouseDown(e, initialPosition, getZoom, onMouseMoveCb, onMouseUpCb);
        if (this.panWrapper.current) {
            this.panWrapper.current.style.cursor = "move";
        }
    };

    render(): JSX.Element {
        const { children, panZoomInfo } = this.props;
        const { zoom } = panZoomInfo;
        const matrixDataTx = -panZoomInfo.topLeftCorner.x * zoom;
        const matrixDataTy = -panZoomInfo.topLeftCorner.y * zoom;
        const matrixData = [zoom, 0, 0, zoom, matrixDataTx, matrixDataTy];
        return (
            <div
                style={{
                    height: "100%",
                    width: "100%"
                }}
                ref={this.panWrapper}
                onMouseDown={this.onMouseDown}
                className="panWrapper">
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        transform: `matrix(${matrixData.toString()})`,
                        userSelect: "none",
                        transformOrigin: "top left"
                    }}>
                    {children}
                </div>
            </div>
        );
    }
}
