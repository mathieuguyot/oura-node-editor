import React from "react";
import _ from "lodash";

import createLinkComponent from "./links";
import { LinkCollection, LinkPositionModel, SelectionItem } from "./model";

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

    const onSelectLink = (id: string, shiftKey: boolean): void => {
        onSelectItem({ id, type: "link" }, shiftKey);
    };

    return (
        <svg
            style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                overflow: "visible"
            }}>
            {/* Render all links */}
            {Object.keys(links).map((key) => {
                if (key in linksPositions) {
                    return createLinkComponent({
                        linkId: key,
                        linkType: links[key].linkType,
                        key,
                        linkPosition: linksPositions[key],
                        isLinkSelected: _.some(selectedItems, { id: key, type: "link" }),
                        onSelectLink
                    });
                }
                return null;
            })}
            {/* Render draggedLink if set */}
            {draggedLink &&
                createLinkComponent({
                    linkType: "bezier",
                    linkPosition: draggedLink,
                    isLinkSelected: false
                })}
        </svg>
    );
}
