import { useContext } from "react";

import { XYPosition } from "../model";
import { LinkProps } from "./common";
import { ThemeContext } from "../theme";

const getCenter = (source: XYPosition, target: XYPosition): XYPosition => {
    const offsetX = Math.abs(target.x - source.x) / 2;
    const xCenter = target.x < source.x ? target.x + offsetX : target.x - offsetX;
    const offsetY = Math.abs(target.y - source.y) / 2;
    const yCenter = target.y < source.y ? target.y + offsetY : target.y - offsetY;
    return { x: xCenter, y: yCenter };
};

export default function BezierLink({
    isLinkSelected,
    linkPosition,
    link,
    linkId,
    onSelectLink
}: LinkProps) {
    const { theme } = useContext(ThemeContext);
    const sourceX = linkPosition.inputPinPosition.x;
    const sourceY = linkPosition.inputPinPosition.y;
    const targetX = linkPosition.outputPinPosition.x;
    const targetY = linkPosition.outputPinPosition.y;
    const center = getCenter(linkPosition.inputPinPosition, linkPosition.outputPinPosition);

    const path = `M${sourceX},${sourceY} C${center.x},${sourceY} ${center.x},${targetY} ${targetX},${targetY}`;
    const style = isLinkSelected
        ? { ...theme?.link?.selected, ...link?.theme?.selected }
        : { ...theme?.link?.unselected, ...link?.theme?.unselected };

    return (
        <path
            id={`link_${linkId}`}
            d={path}
            style={style}
            className={isLinkSelected ? "one-stroke-primary-focus" : "one-stroke-primary"}
            onClick={(e) => {
                if (onSelectLink && linkId) onSelectLink(linkId, e.shiftKey);
            }}
        />
    );
}
