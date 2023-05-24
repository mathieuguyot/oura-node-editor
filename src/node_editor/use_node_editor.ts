import produce from "immer";
import { useCallback, useState } from "react";
import {
    NodeCollection,
    LinkCollection,
    SelectionItem,
    PanZoomModel,
    LinkModel,
    generateUuid,
    ConnectorModel
} from "./model";

export function useNodeEditor() {
    const [nodes, setNodes] = useState<NodeCollection>({});
    const [links, setLinks] = useState<LinkCollection>({});
    const [selectedItems, setSelectedItems] = useState<SelectionItem[]>([]);
    const [panZoomInfo, setPanZoomInfo] = useState<PanZoomModel>({
        zoom: 1,
        topLeftCorner: { x: 0, y: 0 }
    });

    const onNodeMove = useCallback((id: string, newX: number, newY: number, newWidth: number) => {
        setNodes((nodes) =>
            produce(nodes, (draft: NodeCollection) => {
                draft[id].position = { x: newX, y: newY };
                draft[id].width = newWidth;
            })
        );
    }, []);

    const onCreateLink = useCallback((link: LinkModel) => {
        setLinks((links) =>
            produce(links, (draft) => {
                draft[generateUuid()] = link;
            })
        );
    }, []);

    const onConnectorUpdate = useCallback(
        (nodeId: string, cId: string, connector: ConnectorModel) => {
            setNodes((nodes) =>
                produce(nodes, (draft) => {
                    draft[nodeId].connectors[cId] = connector;
                })
            );
        },
        []
    );

    const setSelectedItemsAndMoveSelectedNodeFront = useCallback((selection: SelectionItem[]) => {
        if (selection.length === 1 && selection[0].type === "node") {
            setNodes((nodes: NodeCollection) => {
                const selectedNodeId = selection[0].id;
                const newNodes: NodeCollection = {};
                Object.keys(nodes).forEach((key) => {
                    if (key !== selectedNodeId) {
                        newNodes[key] = nodes[key];
                    }
                });
                newNodes[selectedNodeId] = nodes[selectedNodeId];
                return newNodes;
            });
        }
        setSelectedItems(selection);
    }, []);

    return {
        nodes,
        links,
        panZoomInfo,
        selectedItems,
        setNodes,
        setLinks,
        onNodeMove,
        onCreateLink,
        onConnectorUpdate,
        setPanZoomInfo,
        setSelectedItems: setSelectedItemsAndMoveSelectedNodeFront
    };
}
