import React from "react";
import { produce } from "immer";

import { NodeEditor, NodeModel, LinkModel, PinLayout } from "../../node_editor";

function createRandomNodeModel(): { [nId: string]: NodeModel } {
    const nodes: { [nId: string]: NodeModel } = {};
    for (let index = 0; index < 100; index += 1) {
        nodes[index.toString()] = {
            id: index.toString(),
            name: `node_${index}`,
            width: Math.floor(Math.random() * 300) + 200,
            x: Math.floor(Math.random() * 5000),
            y: Math.floor(Math.random() * 5000),
            connectors: [
                { id: "0", name: "x", pinLayout: PinLayout.LEFT_PIN },
                { id: "1", name: "y", pinLayout: PinLayout.LEFT_PIN, contentType: "string" },
                { id: "2", name: "z", pinLayout: PinLayout.LEFT_PIN },
                { id: "4", name: "sum", pinLayout: PinLayout.RIGHT_PIN },
                { id: "5", name: "abcdefghijklmnopqrstuv", pinLayout: PinLayout.RIGHT_PIN },
                { id: "6", name: "abcdefghijklmnopqrstuv", pinLayout: PinLayout.NO_PINS },
                { id: "7", name: "flow", pinLayout: PinLayout.BOTH_PINS }
            ]
        };
    }
    return nodes;
}

const OuraCanvasApp = (): JSX.Element => {
    const [nodes, setNodes] = React.useState(createRandomNodeModel());
    const [links, setLinks] = React.useState<LinkModel[]>([]);

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
                draft.push(link);
            });
            setLinks(newLinks);
        },
        [links]
    );

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <NodeEditor
                nodes={nodes}
                links={links}
                onNodeMove={onNodeMove}
                onCreateLink={onCreateLink}
            />
            {/* <canvas
                style={{
                    width: 640,
                    height: 480,
                    position: "absolute",
                    right: 20,
                    bottom: 20,
                    backgroundColor: "white"
                }}
            /> */}
        </div>
    );
};

export default OuraCanvasApp;
