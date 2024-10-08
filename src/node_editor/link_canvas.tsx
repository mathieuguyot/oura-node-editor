import { CSSProperties } from "react";
import _ from "lodash";

import { LinkCollection, LinkPositionModel, SelectionItem } from "./model";
import BezierLink from "./link/link_bezier";

export interface LinkCanvasProps {
    links: LinkCollection;
    linksPositions: { [linkId: string]: LinkPositionModel };
    selectedItems: Array<SelectionItem>;
    draggedLink?: LinkPositionModel;

    onSelectItem: (selection: SelectionItem | null, shiftKey: boolean) => void;
}

export default function LinkCanvas(props: LinkCanvasProps): JSX.Element {
    const { links, linksPositions, selectedItems, draggedLink } = props;
    const { onSelectItem } = props;

    const style: CSSProperties = {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        overflow: "visible"
    };

    return (
        <svg style={style} id="link_canvas">
            {/* Render all links */}
            {Object.keys(links)
                .filter((key) => key in linksPositions)
                .map((key) => (
                    <BezierLink
                        linkId={key}
                        link={links[key]}
                        key={key}
                        linkPosition={linksPositions[key]}
                        isLinkSelected={_.some(selectedItems, { id: key, type: "link" })}
                        onSelectLink={(id, shiftKey) =>
                            onSelectItem({ id, type: "link" }, shiftKey)
                        }
                    />
                ))}
            {/* Render draggedLink if set */}
            {draggedLink && <BezierLink linkPosition={draggedLink} isLinkSelected={false} />}
        </svg>
    );
}
