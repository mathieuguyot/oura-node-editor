/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import React from "react";
import { produce, immerable } from "immer";
import _ from "lodash";

import {
    NodeEditor,
    LinkModel,
    NodeModel,
    PanZoomModel,
    generateUuid,
    PinLayout,
    ConnectorModel,
    NodeCollection,
    LinkCollection,
    ConnectorCollection
} from "../../node_editor";
import NodePicker from "../../node_picker";

const getLinks = (links: LinkCollection, nodeId: string, connectorId: string): Array<LinkModel> => {
    const validLinks: Array<LinkModel> = [];
    Object.keys(links).forEach((key) => {
        const link = links[key];
        if (
            (link.inputNodeId === nodeId && link.inputPinId === connectorId) ||
            (link.outputNodeId === nodeId && link.outputPinId === connectorId)
        ) {
            validLinks.push(link);
        }
    });
    return validLinks;
};

abstract class Node implements NodeModel {
    [immerable] = true;
    public name: string;
    public x = 0;
    public y = 0;
    public width: number;
    public connectors: ConnectorCollection;

    constructor(name: string, width: number, connectors: ConnectorCollection) {
        this.name = name;
        this.width = width;
        this.connectors = connectors;
    }

    compute(nodes: NodeCollection, links: LinkCollection): { [id: string]: any } {
        const nodeId = Object.keys(nodes).find((key) => nodes[key] === this);
        if (nodeId) {
            const inputs: { [id: string]: any } = {};
            Object.keys(this.connectors).forEach((key) => {
                const connector = this.connectors[key];
                if (connector.pinLayout === PinLayout.LEFT_PIN) {
                    const otherLinks = getLinks(links, nodeId, key);
                    otherLinks.forEach((link) => {
                        const otherNodeId =
                            link.inputNodeId !== nodeId ? link.inputNodeId : link.outputNodeId;
                        const otherConnectorId =
                            link.inputNodeId === otherNodeId ? link.inputPinId : link.outputPinId;
                        const otherNode = nodes[otherNodeId];
                        const res = (otherNode as Node).compute(nodes, links);
                        if (!(key in inputs)) {
                            inputs[key] = [];
                        }
                        inputs[key].push(res[otherConnectorId]);
                    });
                }
            });
            return this.computeSpecific(inputs);
        }
        return {};
    }

    protected abstract computeSpecific(inputs: { [id: string]: any }): { [id: string]: any };
}

class CanvasRectangle extends Node implements NodeModel {
    constructor() {
        super("rectangle", 100, {
            0: { name: "draw", pinLayout: PinLayout.RIGHT_PIN, data: {} },
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
                data: { value: "100" }
            },
            4: {
                name: "height",
                pinLayout: PinLayout.LEFT_PIN,
                contentType: "string",
                data: { value: "100" }
            }
        });
    }

    protected computeSpecific(inputs: { [id: string]: any }): { [id: string]: any } {
        const y = "1" in inputs ? inputs[1][0] : this.connectors[1].data.value;
        const x = "2" in inputs ? inputs[2][0] : this.connectors[2].data.value;
        const width = "3" in inputs ? inputs[3][0] : this.connectors[3].data.value;
        const height = "4" in inputs ? inputs[4][0] : this.connectors[4].data.value;

        const draw = (ctx: CanvasRenderingContext2D): void => {
            ctx.fillRect(x, y, width, height);
        };

        return { "0": draw };
    }
}

class Canvas2dContext extends Node implements NodeModel {
    [immerable] = true;
    canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
        super("canvas", 100, {
            0: { name: "draw", pinLayout: PinLayout.LEFT_PIN, data: {} }
        });
        this.canvasRef = canvasRef;
    }

    protected computeSpecific(inputs: { [id: string]: any }): { [id: string]: any } {
        if (this.canvasRef.current) {
            const ctx = this.canvasRef.current.getContext("2d");
            if (ctx && inputs[0]) {
                ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
                inputs[0].forEach((draw: (arg0: CanvasRenderingContext2D) => void) => {
                    draw(ctx);
                });
            }
        }
        return {};
    }
}

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

    const nodesSchemas: { [nId: string]: NodeModel } = {
        0: new Canvas2dContext(canvasRef),
        1: new CanvasRectangle()
    };

    const redrawCanvas = React.useCallback((curNodes: NodeCollection, curLink: LinkCollection) => {
        Object.keys(curNodes).forEach((key) => {
            const node = curNodes[key];
            if (node instanceof Canvas2dContext) {
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
                onConnectorUpdate={onConnectorUpdate}
            />
            {canvas}
            {showNodePicker ? nodePicker : null}
        </div>
    );
};

export default OuraCanvasApp;
