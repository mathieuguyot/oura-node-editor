import * as React from "react";
import * as _ from "lodash";

export interface IDragData {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

export interface PanZoomInputState {
    dragging: boolean;
    dragData: IDragData;
    matrixData: number[];
}

export interface PanZoomInputProps {
    zoom: number;
    onUnselection: () => void;
}

export default class PanZoom extends React.Component<PanZoomInputProps, PanZoomInputState> {
    // Used to set cursor while moving.
    private panWrapper: HTMLDivElement | null = null;
    // Used to set transform for pan.
    private panContainer: HTMLDivElement | null = null;

    constructor(props: PanZoomInputProps) {
        super(props);
        const { zoom } = this.props;
        this.state = {
            dragData: { dx: 0, dy: 0, x: 0, y: 0 },
            dragging: false,
            matrixData: [zoom, 0, 0, zoom, 0, 0]
        };
    }

    shouldComponentUpdate(nextProps: PanZoomInputProps, nextState: PanZoomInputState): boolean {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    private onMouseDown = (e: React.MouseEvent<EventTarget>) => {
        const targetClassName = (e.target as Element).className;
        if (targetClassName !== "panWrapper" && targetClassName !== "panContainer") {
            return;
        }
        const { onUnselection } = this.props;
        onUnselection();
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mouseup", this.onMouseUp);
        const { matrixData } = this.state;
        const offsetX = matrixData[4];
        const offsetY = matrixData[5];
        const newDragData: IDragData = {
            dx: offsetX,
            dy: offsetY,
            x: e.pageX,
            y: e.pageY
        };
        this.setState({
            dragData: newDragData,
            dragging: true
        });
        if (this.panWrapper) {
            this.panWrapper.style.cursor = "move";
        }
    };

    static getDerivedStateFromProps(
        props: PanZoomInputProps,
        state: PanZoomInputState
    ): PanZoomInputState | null {
        const { matrixData } = state;
        if (matrixData[0] !== props.zoom) {
            const newMatrixData = _.cloneDeep(state.matrixData);
            newMatrixData[0] = props.zoom || newMatrixData[0];
            newMatrixData[3] = props.zoom || newMatrixData[3];
            return {
                ...state,
                matrixData: newMatrixData
            };
        }
        return null;
    }

    private onMouseUp = () => {
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
        this.setState({
            dragging: false
        });
        if (this.panWrapper) {
            this.panWrapper.style.cursor = "";
        }
    };

    private getNewMatrixData = (x: number, y: number): number[] => {
        const { dragData, matrixData } = this.state;
        const newMatrixData = _.cloneDeep(matrixData);
        const deltaX = dragData.x - x;
        const deltaY = dragData.y - y;
        newMatrixData[4] = dragData.dx - deltaX;
        newMatrixData[5] = dragData.dy - deltaY;
        return newMatrixData;
    };

    public onMouseMove = (e: MouseEvent): void => {
        const { dragging } = this.state;
        if (dragging) {
            const newMatrixData = this.getNewMatrixData(e.pageX, e.pageY);
            this.setState({
                matrixData: newMatrixData
            });
            if (this.panContainer) {
                this.panContainer.style.transform = `matrix(${newMatrixData.toString()})`;
            }
        }
    };

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
