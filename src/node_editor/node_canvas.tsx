import { useCallback, useState } from "react";
import _ from "lodash";

import {
    ConnectorModel,
    LinkModel,
    LinkPositionModel,
    NodeCollection,
    NodePinPositions,
    SelectionItem
} from "./model";
import { Node } from "./node";
import { ConnectorContentProps } from "./connector_content";

export interface NodeCanvasProps {
    nodes: NodeCollection;
    selectedItems: Array<SelectionItem>;

    onSelectItem: (selection: SelectionItem | null, shiftKey: boolean) => void;
    onUpdatePreviewLink: (previewLink?: LinkPositionModel) => void;
    getZoom: () => number;

    onNodeMove: (id: string, newX: number, newY: number, newWidth: number) => void;
    onCreateLink?: (link: LinkModel) => void;
    onConnectorUpdate: (nodeId: string, cId: string, connector: ConnectorModel) => void;
    onNodePinPositionsUpdate: (nodeId: string, pinPositions: NodePinPositions) => void;

    createCustomConnectorComponent?(props: ConnectorContentProps): JSX.Element | null;
}

export default function NodeCanvas({
    nodes,
    selectedItems,
    onSelectItem,
    onUpdatePreviewLink,
    getZoom,
    onNodeMove,
    onCreateLink,
    onConnectorUpdate,
    onNodePinPositionsUpdate,
    createCustomConnectorComponent
}: NodeCanvasProps) {
    const [lastSettedSelection, setLastSettedSelection] = useState<SelectionItem | undefined>();

    const onNodeMoveStart = useCallback(
        (id: string, shiftKey: boolean) => {
            const selection = { id, type: "node" };
            let alreadySelected = false;
            selectedItems.forEach((item) => {
                if (item.id === selection.id && item.type === selection.type) {
                    alreadySelected = true;
                }
            });
            if (alreadySelected) {
                return;
            }
            let newLastSettedSelection: SelectionItem | undefined = selection;
            selectedItems.forEach((item) => {
                if (item.id === id && item.type === "node") {
                    newLastSettedSelection = undefined;
                }
            });
            if (shiftKey && newLastSettedSelection) {
                setLastSettedSelection(newLastSettedSelection);
                onSelectItem(selection, shiftKey);
            }
            if (!shiftKey) {
                setLastSettedSelection(newLastSettedSelection);
                onSelectItem(selection, shiftKey);
            }
        },
        [onSelectItem, selectedItems]
    );

    const onNodeMoveInternal = useCallback(
        (offsetX: number, offsetY: number, offsetWidth: number) => {
            // Move each selected node
            selectedItems.forEach((item) => {
                if (item.type === "node") {
                    const newX = nodes[item.id].position.x + offsetX;
                    const newY = nodes[item.id].position.y + offsetY;
                    const newWidth = nodes[item.id].width + offsetWidth;
                    onNodeMove(item.id, newX, newY, newWidth > 100 ? newWidth : 100);
                }
            });
        },
        [nodes, onNodeMove, selectedItems]
    );

    const onNodeMoveEnd = useCallback(
        (id: string, wasNodeMoved: boolean, shiftKey: boolean) => {
            const selection = { id, type: "node" };
            if (!wasNodeMoved && !shiftKey) {
                onSelectItem(selection, shiftKey);
            } else if (!wasNodeMoved && shiftKey && !_.isEqual(selection, lastSettedSelection)) {
                onSelectItem(selection, shiftKey);
            }
            setLastSettedSelection(undefined);
        },
        [lastSettedSelection, onSelectItem]
    );

    return (
        <>
            {Object.keys(nodes).map((key) => (
                <Node
                    nodeId={key}
                    key={key}
                    node={nodes[key]}
                    isNodeSelected={_.some(selectedItems, { id: key, type: "node" })}
                    getZoom={getZoom}
                    onNodeMoveStart={onNodeMoveStart}
                    onNodeMove={onNodeMoveInternal}
                    onNodeMoveEnd={onNodeMoveEnd}
                    onCreateLink={onCreateLink}
                    onUpdatePreviewLink={onUpdatePreviewLink}
                    onNodePinPositionsUpdate={onNodePinPositionsUpdate}
                    onConnectorUpdate={onConnectorUpdate}
                    createCustomConnectorComponent={createCustomConnectorComponent}
                />
            ))}
        </>
    );
}
