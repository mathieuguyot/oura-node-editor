import * as React from "react";
import * as _ from 'lodash';

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
    private getInitialState = () => {
        const { zoom } = this.props;
        return {
            dragData: {dx: 0, dy:0, x:0, y: 0},
            dragging: false,
            matrixData: [
                zoom, 0, 0, zoom, 0, 0,
            ],
        };
    };
    // Used to set cursor while moving.
    private panWrapper: any;
    // Used to set transform for pan.
    private panContainer: any;
    public state = this.getInitialState();

    shouldComponentUpdate(nextProps: PanZoomInputProps, nextState: PanZoomInputState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState); 
    }

    private onMouseDown = (e: React.MouseEvent<EventTarget>) => {
        const targetClassName = (e.target as Element).className;
        if(targetClassName !== "panWrapper" && targetClassName !== "panContainer")
        {
            return;
        }
        this.props.onUnselection();
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        const { matrixData } = this.state;
        const offsetX = matrixData[4];
        const offsetY = matrixData[5];
        const newDragData: IDragData = {
            dx: offsetX,
            dy: offsetY,
            x: e.pageX,
            y: e.pageY,
        };
        this.setState({
            dragData: newDragData,
            dragging: true,
        });
        if (this.panWrapper) {
            this.panWrapper.style.cursor = "move";
        }
    };

    static getDerivedStateFromProps(props: PanZoomInputProps, state: PanZoomInputState) {
        const { matrixData } = state;
        if (matrixData[0] !== props.zoom) {
            const newMatrixData = _.cloneDeep(state.matrixData);
            newMatrixData[0] = props.zoom || newMatrixData[0];
            newMatrixData[3] = props.zoom || newMatrixData[3];
            return {
                matrixData: newMatrixData,
            };
        }
        return null;
    }

    private onMouseUp = () => {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        this.setState({
            dragging: false,
        });
        if (this.panWrapper) {
            this.panWrapper.style.cursor = "";
        }
    };

    private getNewMatrixData = (x: number, y: number): number[] => {
        const dragData = _.cloneDeep(this.state.dragData);
        const matrixData = _.cloneDeep(this.state.matrixData);
        const deltaX = dragData.x - x;
        const deltaY = dragData.y - y;
        matrixData[4] = dragData.dx - deltaX;
        matrixData[5] = dragData.dy - deltaY;
        return matrixData;
    };

    public onMouseMove = (e: MouseEvent) => {
        if (this.state.dragging) {
            const matrixData = this.getNewMatrixData(e.pageX, e.pageY);
            this.setState({
                matrixData,
            });
            if (this.panContainer) {
                this.panContainer.style.transform = `matrix(${this.state.matrixData.toString()})`;
            }
        }
    };

    public render() {
        return (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                }}
                ref={(ref) => this.panWrapper = ref}
                onMouseDown={this.onMouseDown}
                className="panWrapper"
            >
                <div
                    className="panContainer"
                    ref={(ref) => this.panContainer = ref}
                    style={{
                        height: "100%",
                        width: "100%",
                        transform: `matrix(${this.state.matrixData.toString()})`,
                        userSelect: "none",
                    }}
                >
                    {this.props.children}
                </div>  
            </div>
        );
    }
}
