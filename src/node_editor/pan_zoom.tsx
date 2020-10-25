import * as React from "react";
import * as _ from "lodash";
import { produce } from "immer";
import { DragWrapper } from "./events_wrappers";
import { XYPosition } from "./model";

export interface PanZoomInputState {
    matrixData: number[];
}

export interface PanZoomInputProps {
    getZoom: () => number;
}

export default class PanZoom extends React.Component<PanZoomInputProps, PanZoomInputState> {
    // Used to set cursor while moving.
    private panWrapper: HTMLDivElement | null = null;
    // Used to set transform for pan.
    private panContainer: HTMLDivElement | null = null;
    private dragWrapper: DragWrapper = new DragWrapper();

    constructor(props: PanZoomInputProps) {
        super(props);
        const { getZoom } = this.props;
        const zoom = getZoom();
        this.state = {
            matrixData: [zoom, 0, 0, zoom, 0, 0]
        };
    }

    shouldComponentUpdate(nextProps: PanZoomInputProps, nextState: PanZoomInputState): boolean {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    private onMouseDown = (e: React.MouseEvent) => {
        const { getZoom } = this.props;

        const onMouseMoveCb = (
            initialPos: XYPosition,
            finalPos: XYPosition,
            offSetPos: XYPosition
        ) => {
            const zoom = getZoom();
            this.setState(
                produce((draftState: PanZoomInputState) => {
                    draftState.matrixData[4] += offSetPos.x * zoom;
                    draftState.matrixData[5] += offSetPos.y * zoom;
                    if (this.panContainer) {
                        this.panContainer.style.transform = `matrix(${draftState.matrixData.toString()})`;
                    }
                })
            );
        };

        const onMouseUpCb = () => {
            if (this.panWrapper) {
                this.panWrapper.style.cursor = "";
            }
        };

        const initialPosition: XYPosition = { x: e.pageX, y: e.pageY };
        this.dragWrapper.onMouseDown(e, initialPosition, getZoom, onMouseMoveCb, onMouseUpCb);
        if (this.panWrapper) {
            this.panWrapper.style.cursor = "move";
        }
    };

    static getDerivedStateFromProps(
        props: PanZoomInputProps,
        state: PanZoomInputState
    ): PanZoomInputState | null {
        const { matrixData } = state;
        const zoom = props.getZoom();
        if (matrixData[0] !== zoom) {
            const newMatrixData = [...state.matrixData];
            newMatrixData[0] = zoom;
            newMatrixData[3] = zoom;
            return {
                ...state,
                matrixData: newMatrixData
            };
        }
        return null;
    }

    render(): JSX.Element {
        const { matrixData } = this.state;
        const { children } = this.props;
        return (
            <div
                style={{
                    height: "100%",
                    width: "100%"
                }}
                ref={(ref) => {
                    this.panWrapper = ref;
                }}
                onMouseDown={this.onMouseDown}
                className="panWrapper">
                <div
                    className="panContainer"
                    ref={(ref) => {
                        this.panContainer = ref;
                    }}
                    style={{
                        height: "100%",
                        width: "100%",
                        transform: `matrix(${matrixData.toString()})`,
                        userSelect: "none"
                    }}>
                    {children}
                </div>
            </div>
        );
    }
}
