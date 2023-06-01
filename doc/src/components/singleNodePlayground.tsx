import React, { useCallback, useEffect, useState } from "react";
import { NodeEditor, useNodeEditor } from "oura-node-editor";
import Editor from "@monaco-editor/react";
import { useColorMode } from "@docusaurus/preset-classic/node_modules/@docusaurus/theme-common";

const defaultNode = {
    name: "rectangle",
    position: { x: 50, y: 50 },
    width: 200,
    connectors: {
        "0": { name: "draw", pinLayout: 2, contentType: "none", data: {} },
        "1": {
            name: "x",
            pinLayout: 1,
            contentType: "number",
            data: { value: 20, disabled: true }
        },
        "2": {
            name: "y",
            pinLayout: 1,
            contentType: "number",
            data: { value: 20, disabled: true }
        },
        "3": {
            name: "width",
            pinLayout: 1,
            contentType: "number",
            data: { value: 100, disabled: false }
        },
        "4": {
            name: "height",
            pinLayout: 1,
            contentType: "number",
            data: { value: 100, disabled: false }
        },
        "5": {
            name: "color",
            pinLayout: 1,
            contentType: "none",
            data: { value: "black" },
            leftPinColor: "orange"
        },
        "6": {
            name: "type",
            pinLayout: 0,
            contentType: "select",
            data: { values: ["fill", "stroke", "clear"], selected_index: 0 }
        },
        "7": {
            name: "line width",
            pinLayout: 1,
            contentType: "number",
            data: { value: 1, disabled: false }
        }
    },
    category: "canvas"
};

export default function SingleNodePlayground() {
    const { isDarkTheme } = useColorMode();
    const { nodes, links, panZoomInfo, setNodes, setLinks, setPanZoomInfo, onConnectorUpdate } =
        useNodeEditor();

    useEffect(() => {
        setNodes([defaultNode]);
        setLinks({});
    }, [setLinks, setNodes]);

    const [nodeJson, setNodeJson] = useState(JSON.stringify(defaultNode, null, 4));

    const onGenerate = useCallback(() => {
        try {
            const node = JSON.parse(nodeJson);
            setNodes([node]);
        } catch (e) {
            console.error(e);
        }
    }, [nodeJson, setNodes]);

    return (
        <div
            style={{
                display: "flex",
                height: "521px"
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                <Editor
                    theme={isDarkTheme ? "vs-dark" : "vs"}
                    height="500px"
                    defaultLanguage="json"
                    defaultValue={nodeJson}
                    onChange={(e) => setNodeJson(e)}
                />
                <button onClick={onGenerate}>generate</button>
            </div>

            <div style={{ width: "50%", height: "521.5px" }}>
                <NodeEditor
                    panZoomInfo={panZoomInfo}
                    nodes={nodes}
                    links={links}
                    selectedItems={[]}
                    onPanZoomInfo={setPanZoomInfo}
                    onSelectedItems={() => {}}
                    onConnectorUpdate={onConnectorUpdate}
                />
            </div>
        </div>
    );
}
