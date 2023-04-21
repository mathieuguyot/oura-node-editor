import { useContext } from "react";

import { LinkProps } from "./common";
import { ThemeContext } from "../theme";

export default function LineLink({
    isLinkSelected,
    linkPosition,
    link,
    linkId,
    onSelectLink
}: LinkProps) {
    const { theme } = useContext(ThemeContext);

    const style = isLinkSelected
        ? { ...theme?.link?.selected, ...link?.theme?.selected }
        : { ...theme?.link?.unselected, ...link?.theme?.unselected };

    return (
        <line
            id={`link_${linkId}`}
            x1={linkPosition.inputPinPosition.x}
            y1={linkPosition.inputPinPosition.y}
            x2={linkPosition.outputPinPosition.x}
            y2={linkPosition.outputPinPosition.y}
            style={style}
            onClick={(e) => {
                if (onSelectLink && linkId) onSelectLink(linkId, e.shiftKey);
            }}
        />
    );
}
