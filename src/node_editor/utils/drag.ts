import { useCallback, useEffect, useState } from "react";
import { XYPosition } from "../model";

type MouseMoveCb = (
    initialPos: XYPosition,
    finalPos: XYPosition,
    offSetPos: XYPosition,
    targetClassName: string
) => void;
type MouseUpCb = (initialPos: XYPosition, finalPos: XYPosition, event: MouseEvent) => void;

/* useDrag custom hook helping to simplify computations of drag motions */
export function useDrag(
    getZoom: () => number,
    onMouseMoveCb: MouseMoveCb,
    onMouseUpCb: MouseUpCb,
    switchAxis: boolean = false
) {
    const [initialPos, setInitialPos] = useState<XYPosition>({ x: 0, y: 0 });
    const [finalPos, setFinalPos] = useState<XYPosition>({ x: 0, y: 0 });
    const [tmpPos, setTmpPos] = useState<XYPosition>({ x: 0, y: 0 });
    const [lastZoom, setLastZoom] = useState<number>(0);
    const [mouseDown, setMouseDown] = useState<boolean>(false);

    const onMouseDown = useCallback(
        (event: React.MouseEvent, initialPos: XYPosition) => {
            setInitialPos(initialPos);
            setFinalPos(initialPos);
            const zoom = getZoom();
            setTmpPos({ x: event.pageX / zoom, y: event.pageY / zoom });
            setLastZoom(zoom);
            setMouseDown(true);
        },
        [getZoom]
    );

    const onMouseMove = useCallback(
        (event: MouseEvent) => {
            const zoom = getZoom();
            const offsetPos = {
                x: event.pageX / lastZoom - tmpPos.x,
                y: event.pageY / lastZoom - tmpPos.y
            };
            const newFinalPos = {
                x: finalPos.x + (switchAxis ? offsetPos.y : offsetPos.x),
                y: finalPos.y + (switchAxis ? offsetPos.x : offsetPos.y)
            };
            setFinalPos(newFinalPos);
            const newTmpPos = { x: event.pageX / zoom, y: event.pageY / zoom };
            setTmpPos(newTmpPos);
            const targetClassName = (event.target as Element).className;
            onMouseMoveCb({ ...initialPos }, { ...newFinalPos }, offsetPos, targetClassName);
            setLastZoom(zoom);
        },
        [
            finalPos.x,
            finalPos.y,
            getZoom,
            initialPos,
            lastZoom,
            onMouseMoveCb,
            switchAxis,
            tmpPos.x,
            tmpPos.y
        ]
    );

    const onMouseUp = useCallback(
        (event: MouseEvent) => {
            setMouseDown(false);
            onMouseUpCb({ ...initialPos }, { ...finalPos }, event);
        },
        [finalPos, initialPos, onMouseUpCb]
    );

    useEffect(() => {
        if (mouseDown) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [mouseDown, onMouseMove, onMouseUp]);

    return { onMouseDown };
}
