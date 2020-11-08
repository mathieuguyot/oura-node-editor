/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { produce } from "immer";
import _ from "lodash";

import {
    NodeEditor,
    LinkModel,
    PanZoomModel,
    generateUuid,
    ConnectorModel,
    NodeCollection,
    LinkCollection,
    NodeModel
} from "../../node_editor";
import NodePicker from "../../node_picker";
import { createNodeSchema, Node } from "./nodes";
import CanvasNode from "./nodes/canvas";

const OuraCanvasApp = (): JSX.Element => {
    const [showNodePicker, setShowNodePicker] = React.useState(false);
    const [keysDown, setKeysDown] = React.useState<Set<string>>(new Set());
    const [panZoomInfo, setPanZoomInfo] = React.useState<PanZoomModel>({
        zoom: 1,
        topLeftCorner: { x: 0, y: 0 }
    });
    const [nodes, setNodes] = React.useState<NodeCollection>({});
    const [links, setLinks] = React.useState<LinkCollection>({});
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const nodesSchemas: { [nId: string]: NodeModel } = createNodeSchema(canvasRef);

    const redrawCanvas = React.useCallback((curNodes: NodeCollection, curLink: LinkCollection) => {
        Object.keys(curNodes).forEach((key) => {
            const node = curNodes[key];
            if (node instanceof CanvasNode) {
                (node as Node).compute(curNodes, curLink);
            }
        });
    }, []);

    const onNodeMove = React.useCallback(
        (id: string, newX: number, newY: number, newWidth: number) => {
            const newNodes = produce(nodes, (draft: NodeCollection) => {
                draft[id].x = newX;
                draft[id].y = newY;
                draft[id].width = newWidth;
            });
            setNodes(newNodes);
        },
        [nodes]
    );

    const onCreateLink = React.useCallback(
        (link: LinkModel) => {
            const newLinks = produce(links, (draft) => {
                draft[generateUuid()] = link;
            });
            setLinks(newLinks);
            redrawCanvas(nodes, newLinks);
        },
        [nodes, links]
    );

    const onNodeDeletion = React.useCallback(
        (id: string) => {
            const newNodes = { ...nodes };
            delete newNodes[id];
            const newLinks = produce(links, (draft: LinkCollection) => {
                Object.keys(links).forEach((key) => {
                    const link = links[key];
                    if (link.inputNodeId === id || link.outputNodeId === id) {
                        delete draft[key];
                    }
                });
            });
            setNodes(newNodes);
            setLinks(newLinks);
            redrawCanvas(newNodes, newLinks);
        },
        [nodes, links]
    );

    const onLinkDeletion = React.useCallback(
        (id: string) => {
            const newLinks = { ...links };
            delete newLinks[id];
            setLinks(newLinks);
            redrawCanvas(nodes, newLinks);
        },
        [nodes, links]
    );

    const onKeyDown = React.useCallback(
        (event: React.KeyboardEvent) => {
            const newKeys = produce(keysDown, (draft) => {
                draft.add(event.key.toLowerCase());
            });
            setKeysDown(newKeys);
            if (newKeys.has("shift") && newKeys.has("a")) {
                setShowNodePicker(!showNodePicker);
            }
            if (newKeys.has("escape") && showNodePicker) {
                setShowNodePicker(false);
            }
        },
        [keysDown, showNodePicker]
    );

    const onKeyUp = React.useCallback(
        (event: React.KeyboardEvent) => {
            const newKeys = produce(keysDown, (draft) => {
                draft.delete(event.key.toLowerCase());
            });
            setKeysDown(newKeys);
        },
        [keysDown]
    );

    const onNodeSelection = React.useCallback(
        (id: string) => {
            const newNode = _.clone(nodesSchemas[id]);
            newNode.x = panZoomInfo.topLeftCorner.x + 10;
            newNode.y = panZoomInfo.topLeftCorner.y + 10;
            const newNodes = produce(nodes, (draft) => {
                draft[generateUuid()] = newNode;
            });
            setNodes(newNodes);
            setShowNodePicker(false);
        },
        [panZoomInfo, nodes, links, showNodePicker]
    );

    const onConnectorUpdate = React.useCallback(
        (nodeId: string, connectorId: string, connector: ConnectorModel) => {
            const newNodes = produce(nodes, (draft) => {
                draft[nodeId].connectors[connectorId] = connector;
            });
            setNodes(newNodes);
            redrawCanvas(newNodes, links);
        },
        [nodes, links]
    );

    const canvas = (
        <canvas
            width={640}
            height={480}
            style={{
                width: 640,
                height: 480,
                position: "absolute",
                right: 20,
                bottom: 20,
                backgroundColor: "white"
            }}
            ref={canvasRef}
        />
    );

    const nodePicker = (
        <div
            style={{
                width: 640,
                height: 480,
                position: "absolute",
                top: "calc(50% - 240px)",
                left: "calc(50% - 320px)",
                backgroundColor: "white"
            }}>
            <NodePicker nodesSchema={nodesSchemas} onNodeSelection={onNodeSelection} />
        </div>
    );

    return (
        <div
            style={{ width: "100%", height: "100vh" }}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            tabIndex={0}>
            <NodeEditor
                panZoomInfo={panZoomInfo}
                nodes={nodes}
                links={links}
                setPanZoomInfo={setPanZoomInfo}
                onNodeMove={onNodeMove}
                onCreateLink={onCreateLink}
                onNodeDeletion={onNodeDeletion}
                onLinkDeletion={onLinkDeletion}
                onConnectorUpdate={onConnectorUpdate}
            />
            {canvas}
            {showNodePicker ? nodePicker : null}
        </div>
    );
};

export default OuraCanvasApp;
