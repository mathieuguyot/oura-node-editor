/* eslint-disable no-bitwise */
import React from "react";
import { produce } from "immer";

import {
    NodeEditor,
    LinkModel,
    NodeModel,
    PanZoomModel,
    generateUuid,
    PinLayout,
    ConnectorModel
} from "../../node_editor";
import NodePicker from "../../node_picker";

const nodesSchemas: { [nId: string]: NodeModel } = {
    0: {
        name: "Canvas 2d context",
        width: 100,
        x: 0,
        y: 0,
        connectors: {
            0: { name: "ctx2d", pinLayout: PinLayout.RIGHT_PIN, data: {} }
        }
    },
    1: {
        name: "rectangle",
        width: 100,
        x: 0,
        y: 0,
        connectors: {
            0: { name: "ctx2d", pinLayout: PinLayout.BOTH_PINS, data: {} },
            1: {
                name: "y",
                pinLayout: PinLayout.LEFT_PIN,
                contentType: "string",
                data: { value: "0" }
            },
            2: {
                name: "z",
                pinLayout: PinLayout.LEFT_PIN,
                contentType: "string",
                data: { value: "0" }
            },
            3: {
                name: "width",
                pinLayout: PinLayout.LEFT_PIN,
                contentType: "string",
                data: { value: "0" }
            },
            4: {
                name: "height",
                pinLayout: PinLayout.LEFT_PIN,
                contentType: "string",
                data: { value: "0" }
            }
        }
    }
};

const OuraCanvasApp = (): JSX.Element => {
    const [showNodePicker, setShowNodePicker] = React.useState(false);
    const [keysDown, setKeysDown] = React.useState<Set<string>>(new Set());
    const [panZoomInfo, setPanZoomInfo] = React.useState<PanZoomModel>({
        zoom: 1,
        topLeftCorner: { x: 0, y: 0 }
    });
    const [nodes, setNodes] = React.useState<{ [nId: string]: NodeModel }>({});
    const [links, setLinks] = React.useState<{ [nId: string]: LinkModel }>({});
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const onNodeMove = React.useCallback(
        (id: string, newX: number, newY: number, newWidth: number) => {
            const newNodes = produce(nodes, (draft) => {
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
        },
        [links]
    );

    const onNodeDeletion = React.useCallback(
        (id: string) => {
            const newNodes = { ...nodes };
            delete newNodes[id];
            const newLinks = produce(links, (draft: { [nId: string]: LinkModel }) => {
                Object.keys(links).forEach((key) => {
                    const link = links[key];
                    if (link.inputNodeId === id || link.outputNodeId === id) {
                        delete draft[key];
                    }
                });
            });
            setNodes(newNodes);
            setLinks(newLinks);
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
            const newNode = { ...nodesSchemas[id] };
            newNode.x = panZoomInfo.topLeftCorner.x + 10;
            newNode.y = panZoomInfo.topLeftCorner.y + 10;
            const newNodes = produce(nodes, (draft) => {
                draft[generateUuid()] = newNode;
            });
            setNodes(newNodes);
            setShowNodePicker(false);
        },
        [panZoomInfo, nodes, showNodePicker]
    );

    const onConnectorUpdate = React.useCallback(
        (nodeId: string, connectorId: string, connector: ConnectorModel) => {
            const newNodes = produce(nodes, (draft) => {
                draft[nodeId].connectors[connectorId] = connector;
            });
            setNodes(newNodes);
        },
        [nodes]
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

    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
            ctx.beginPath();
            ctx.rect(0, 0, 200, 100);
            ctx.stroke();
        }
    }

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
                onConnectorUpdate={onConnectorUpdate}
            />
            {canvas}
            {showNodePicker ? nodePicker : null}
        </div>
    );
};

export default OuraCanvasApp;
