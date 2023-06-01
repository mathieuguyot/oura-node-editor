import React, { useEffect, useRef } from "react";
import { NodeEditor, useNodeEditor } from "oura-node-editor";

const nodesStub = {
    "2528811a-3c8f-425e-939e-16dc4c185b82": {
        name: "rectangle",
        position: { x: 611.1725757080437, y: 96.64498202026894 },
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
    },
    "bbbb9f7e-5769-478a-85a3-1097a675ba17": {
        name: "number",
        position: { x: 312, y: 182 },
        width: 170,
        connectors: {
            "0": { name: "number", pinLayout: 2, contentType: "number", data: { value: "20" } }
        },
        category: "math"
    }
};

const linkStub = {
    "433c4ede-7181-43fd-9249-000614bcb858": {
        leftNodeId: "2528811a-3c8f-425e-939e-16dc4c185b82",
        leftNodeConnectorId: "1",
        rightNodeId: "bbbb9f7e-5769-478a-85a3-1097a675ba17",
        rightNodeConnectorId: "0"
    },
    "77468d68-7eeb-4bce-ae3e-15585af52a02": {
        leftNodeId: "2528811a-3c8f-425e-939e-16dc4c185b82",
        leftNodeConnectorId: "2",
        rightNodeId: "bbbb9f7e-5769-478a-85a3-1097a675ba17",
        rightNodeConnectorId: "0"
    }
};

export default function IntroNodeEditor() {
    const {
        nodes,
        links,
        panZoomInfo,
        selectedItems,
        setNodes,
        setLinks,
        onNodeMove,
        setPanZoomInfo,
        setSelectedItems,
        onCreateLink,
        onConnectorUpdate
    } = useNodeEditor();

    useEffect(() => {
        setNodes(nodesStub);
        setLinks(linkStub);
    }, [setLinks, setNodes]);

    // const mainDivRef = useRef<HTMLDivElement | null>(null);
    // useEffect(() => {
    //     if (mainDivRef && mainDivRef.current) {
    //         mainDivRef.current.setAttribute("data-theme", "fantasy");
    //     }
    // }, [mainDivRef]);

    return (
        <div style={{ width: "100%", height: "100vh", zIndex: 1000 }}>
            <NodeEditor
                panZoomInfo={panZoomInfo}
                nodes={nodes}
                links={links}
                selectedItems={selectedItems}
                onPanZoomInfo={setPanZoomInfo}
                onSelectedItems={setSelectedItems}
                onNodeMove={onNodeMove}
                onCreateLink={onCreateLink}
                onConnectorUpdate={onConnectorUpdate}
            />
        </div>
    );
}
