import { useCallback, useEffect, useState } from "react";
import { produce, enableMapSet, setAutoFreeze } from "immer";
import _ from "lodash";

import {
    LinkModel,
    LinkPositionModel,
    arePositionEquals,
    PanZoomModel,
    ConnectorModel,
    NodeCollection,
    LinkCollection,
    SelectionItem,
    NodePinPositions,
    XYPosition
} from "./model";
import PanZoom from "./pan_zoom";
import BackGround from "./background";
import LinkCanvas from "./link_canvas";
import NodeCanvas from "./node_canvas";
import { ThemeContext, darkTheme, ThemeContextType } from "./theme";
import { ConnectorContentProps } from "./connector_content/common";
import "../index.css";

enableMapSet();
setAutoFreeze(false);

type NodeEditorProps = {
    nodes: NodeCollection;
    links: LinkCollection;
    panZoomInfo: PanZoomModel;
    selectedItems: Array<SelectionItem>;
    theme?: ThemeContextType;

    onNodeMove?(id: string, newX: number, newY: number, newWidth: number): void;
    onCreateLink?(link: LinkModel): void;
    onConnectorUpdate?: (nodeId: string, cId: string, connector: ConnectorModel) => void;

    onPanZoomInfo: (panZoomInfo: PanZoomModel) => void;
    onSelectedItems: (selection: Array<SelectionItem>) => void;

    createCustomConnectorComponent?(props: ConnectorContentProps): JSX.Element | null;
};

function NodeEditor(props: NodeEditorProps) {
    const {
        nodes,
        links,
        panZoomInfo,
        selectedItems,
        theme,
        onNodeMove,
        onCreateLink,
        onConnectorUpdate,
        onPanZoomInfo,
        onSelectedItems,
        createCustomConnectorComponent
    } = props;
    const [linksPositions, setLinksPositions] = useState<{ [linkId: string]: LinkPositionModel }>(
        {}
    );
    const [nodesPinPositions, setNodesPinPositions] = useState<{
        [nodeId: string]: NodePinPositions;
    }>({});
    const [nodesHeights, setNodesHeights] = useState<{
        [nodeId: string]: number;
    }>({});
    const [draggedLink, setDraggedLink] = useState<LinkPositionModel | undefined>();

    useEffect(() => {
        let redrawPinPosition = false;
        const newLinksPositions = produce(linksPositions, (draft) => {
            // Create or update position of all links positions that need so
            Object.keys(links).forEach((key) => {
                const link = links[key];
                if (
                    link.leftNodeId in nodesPinPositions === false ||
                    link.rightNodeId in nodesPinPositions === false
                ) {
                    return;
                }
                const iNPins = nodesPinPositions[link.leftNodeId][link.leftNodeConnectorId];
                const oNPins = nodesPinPositions[link.rightNodeId][link.rightNodeConnectorId];
                if (iNPins && oNPins) {
                    const inputPinPosition = iNPins[0];
                    const outputPinPosition = oNPins[1];
                    if (inputPinPosition && outputPinPosition) {
                        if (
                            !(key in draft) ||
                            !arePositionEquals(draft[key].inputPinPosition, inputPinPosition) ||
                            !arePositionEquals(draft[key].outputPinPosition, outputPinPosition)
                        ) {
                            draft[key] = { linkId: key, inputPinPosition, outputPinPosition };
                            redrawPinPosition = true;
                        }
                    }
                }
            });
            // Remove link positions that belongs to a deleted links
            Object.keys(linksPositions).forEach((key) => {
                if (!(key in links)) {
                    delete draft[key];
                    redrawPinPosition = true;
                }
            });
        });
        if (redrawPinPosition) {
            setLinksPositions(newLinksPositions);
        }
    }, [linksPositions, nodesPinPositions, links, nodes]);

    const onSelectItem = useCallback(
        (selection: SelectionItem | null, shiftKey: boolean) => {
            if (!selection && !shiftKey) {
                onSelectedItems([]);
            } else if (selection && shiftKey && _.some(selectedItems, selection)) {
                const newSelection = [...selectedItems];
                let indexToDelete = -1;
                selectedItems.forEach((item, index) => {
                    if (item.id === selection.id && item.type === selection.type) {
                        indexToDelete = index;
                    }
                });
                if (indexToDelete !== -1) {
                    newSelection.splice(indexToDelete, 1);
                }
                onSelectedItems(newSelection);
            } else if (selection && !_.some(selectedItems, selection)) {
                let newSelection = [...selectedItems];
                if (!shiftKey) {
                    newSelection = [];
                }
                newSelection.push(selection);
                onSelectedItems(newSelection);
            }
            if (!shiftKey && selection) {
                onSelectedItems([selection]);
            }
        },
        [onSelectedItems, selectedItems]
    );

    const onNodePinPositionsUpdate = useCallback(
        (nodeId: string, pinPositions: NodePinPositions) => {
            setNodesPinPositions((nodesPinPos) => {
                return produce(nodesPinPos, (draft) => {
                    draft[nodeId] = pinPositions;
                });
            });
        },
        []
    );

    const onNodeHeightUpdate = useCallback((nodeId: string, height: number) => {
        setNodesHeights((nodesHeights) => {
            return produce(nodesHeights, (draft) => {
                draft[nodeId] = height;
            });
        });
    }, []);

    const onRectSelection = useCallback(
        (topLeft: XYPosition, width: number, height: number, shiftKey: boolean) => {
            const selection: Array<SelectionItem> = shiftKey ? [...selectedItems] : [];
            Object.keys(nodes).forEach((key) => {
                const node = nodes[key];
                if (
                    !selection.map((s) => s.id).includes(key) &&
                    topLeft.y < node.position.x + node.width &&
                    topLeft.y + width > node.position.x &&
                    topLeft.x < node.position.y + nodesHeights[key] &&
                    height + topLeft.x > node.position.y
                ) {
                    selection.push({ id: key, type: "node" });
                }
            });
            onSelectedItems(selection);
        },
        [nodes, nodesHeights, selectedItems, onSelectedItems]
    );

    const localOnCreateLink = useCallback(
        (link: LinkModel) => {
            if (onCreateLink && link.leftNodeId !== link.rightNodeId) {
                onCreateLink(link);
            }
        },
        [onCreateLink]
    );

    return (
        <ThemeContext.Provider value={theme || darkTheme}>
            <div style={{ width: "100%", height: "100%" }}>
                <BackGround panZoomInfo={panZoomInfo}>
                    <PanZoom
                        panZoomInfo={panZoomInfo}
                        onPanZoomInfo={onPanZoomInfo}
                        onSelectItem={onSelectItem}
                        onRectSelection={onRectSelection}
                    >
                        <LinkCanvas
                            links={links}
                            linksPositions={linksPositions}
                            draggedLink={draggedLink}
                            selectedItems={selectedItems}
                            onSelectItem={onSelectItem}
                        />
                        <NodeCanvas
                            nodes={nodes}
                            getZoom={() => {
                                return panZoomInfo.zoom;
                            }}
                            onNodeMove={onNodeMove ? onNodeMove : () => {}}
                            onCreateLink={localOnCreateLink}
                            onUpdatePreviewLink={(p) => {
                                setDraggedLink(p);
                            }}
                            onConnectorUpdate={onConnectorUpdate ? onConnectorUpdate : () => {}}
                            onNodePinPositionsUpdate={onNodePinPositionsUpdate}
                            selectedItems={selectedItems}
                            onSelectItem={onSelectItem}
                            createCustomConnectorComponent={createCustomConnectorComponent}
                            onNodeHeightUpdate={onNodeHeightUpdate}
                        />
                    </PanZoom>
                </BackGround>
            </div>
        </ThemeContext.Provider>
    );
}

export default NodeEditor;
