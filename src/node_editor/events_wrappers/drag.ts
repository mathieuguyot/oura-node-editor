import { XYPosition } from "../model";

type MouseMoveCb = (
    initialPos: XYPosition,
    finalPos: XYPosition,
    offSetPos: XYPosition,
    targetClassName: string
) => void;
type MouseUpCb = (initialPos: XYPosition, finalPos: XYPosition, targetClassName: string) => void;

/* onMouse(down|move|up) events wrapper helping to simplify computations of drag motions */
export default class DragWrapper {
    private onMouseMoveCb: MouseMoveCb = () => null;
    private onMouseUpCb: MouseUpCb = () => null;
    private initialPos: XYPosition = { x: 0, y: 0 };
    private finalPos: XYPosition = { x: 0, y: 0 };
    private tmpPos: XYPosition = { x: 0, y: 0 };
    private getZoom = () => {
        return 1;
    };
    private targetClassName = "";
    private lastZoom = 0;

    constructor() {
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    onMouseDown(
        event: React.MouseEvent,
        initialPos: XYPosition,
        getZoom: () => number,
        onMouseMove: MouseMoveCb,
        onMouseUp: MouseUpCb
    ): void {
        event.stopPropagation();
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mouseup", this.onMouseUp);
        this.getZoom = getZoom;
        this.initialPos = initialPos;
        this.finalPos = { x: initialPos.x, y: initialPos.y };
        const zoom = getZoom();
        this.lastZoom = zoom;
        this.tmpPos = { x: event.pageX / zoom, y: event.pageY / zoom };
        this.onMouseMoveCb = onMouseMove;
        this.onMouseUpCb = onMouseUp;
    }

    private onMouseMove(event: MouseEvent) {
        event.stopPropagation();
        const zoom = this.getZoom();
        const offsetPos = {
            x: event.pageX / this.lastZoom - this.tmpPos.x,
            y: event.pageY / this.lastZoom - this.tmpPos.y
        };
        this.finalPos.x += offsetPos.x;
        this.finalPos.y += offsetPos.y;
        this.tmpPos = { x: event.pageX / zoom, y: event.pageY / zoom };
        const targetClassName = (event.target as Element).className;
        if (typeof targetClassName === "string") {
            this.targetClassName = targetClassName;
        }
        this.onMouseMoveCb(
            { ...this.initialPos },
            { ...this.finalPos },
            offsetPos,
            this.targetClassName
        );
        this.lastZoom = zoom;
    }

    private onMouseUp() {
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
        this.onMouseUpCb({ ...this.initialPos }, { ...this.finalPos }, this.targetClassName);
    }
}
