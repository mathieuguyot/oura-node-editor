import React from "react";
import { mount } from "@cypress/react";
import produce from "immer";
import { NodeEditor, PinLayout } from "../../src/node_editor";
import "../../src/index.css";
import {
    PanZoomModel,
    NodeCollection,
    LinkCollection,
    SelectionItem,
    PinSide
} from "../../src/node_editor/model";

const SingleNodeNodeEditor = (): JSX.Element => {
    const [selectedItems, setSelectedItems] = React.useState<SelectionItem[]>([]);
    const [panZoomInfo, setPanZoomInfo] = React.useState<PanZoomModel>({
        zoom: 1,
        topLeftCorner: { x: 0, y: 0 }
    });
    const [nodes, setNodes] = React.useState<NodeCollection>({
        0: {
            name: "node_0",
            width: 200,
            position: { x: 400, y: 100 },
            connectors: {
                0: { name: "x", pinLayout: PinLayout.LEFT_PIN, contentType: "none", data: {} },
                1: { name: "y", pinLayout: PinLayout.LEFT_PIN, contentType: "none", data: {} }
            }
        },
        1: {
            name: "node_1",
            width: 200,
            position: { x: 100, y: 100 },
            connectors: {
                0: { name: "x", pinLayout: PinLayout.RIGHT_PIN, contentType: "none", data: {} },
                1: { name: "y", pinLayout: PinLayout.RIGHT_PIN, contentType: "none", data: {} }
            }
        }
    });
    const [links] = React.useState<LinkCollection>({
        0: {
            inputNodeId: "0",
            inputPinId: "0",
            inputPinSide: PinSide.LEFT,
            outputNodeId: "1",
            outputPinId: "0",
            outputPinSide: PinSide.RIGHT
        },
        1: {
            inputNodeId: "0",
            inputPinId: "1",
            inputPinSide: PinSide.LEFT,
            outputNodeId: "1",
            outputPinId: "1",
            outputPinSide: PinSide.RIGHT
        }
    });

    const onNodeMove = React.useCallback(
        (id: string, newX: number, newY: number, newWidth: number) => {
            const newNodes = produce(nodes, (draft) => {
                draft[id].position = { x: newX, y: newY };
                draft[id].width = newWidth;
            });
            setNodes(newNodes);
        },
        [nodes]
    );

    return (
        <div style={{ width: "100%", height: "100vh" }} id="root">
            <NodeEditor
                panZoomInfo={panZoomInfo}
                onPanZoomInfo={setPanZoomInfo}
                nodes={nodes}
                links={links}
                onNodeMove={onNodeMove}
                onCreateLink={() => null}
                selectedItems={selectedItems}
                onSelectedItems={setSelectedItems}
            />
        </div>
    );
};

describe(`NodeEditor selection`, () => {
    // Test utils interactions & check functions section
    const clickNode = (id: string, shiftKey: boolean) => {
        cy.get(`#node_${id}`)
            .trigger("mousedown", "center", { force: true, shiftKey })
            .trigger("mouseup", { force: true, shiftKey });
    };

    const clickAndMoveNode = (id: string, shiftKey: boolean) => {
        cy.get(`#node_${id}`)
            .trigger("mousedown", "center", { force: true, shiftKey })
            .trigger("mousemove", { force: true, shiftKey, pageX: 0, pageY: 0 })
            .trigger("mouseup", { force: true, shiftKey });
    };

    const clickLink = (id: string, shiftKey: boolean) => {
        cy.get(`#link_${id}`).click({ force: true, shiftKey });
    };

    const clickPanZoom = (shiftKey: boolean) => {
        cy.get("#panzoom").click({ shiftKey });
    };

    const checkSelection = (
        node0Selected: boolean,
        node1Selected: boolean,
        link0Selected: boolean,
        link1Selected: boolean
    ) => {
        cy.get("#link_0").should(
            "have.css",
            "stroke",
            link0Selected ? "rgb(255, 255, 255)" : "rgba(170, 170, 170, 0.75)"
        );
        cy.get("#link_1").should(
            "have.css",
            "stroke",
            link1Selected ? "rgb(255, 255, 255)" : "rgba(170, 170, 170, 0.75)"
        );
        cy.get("#node_0").should(
            "have.css",
            "box-shadow",
            node0Selected ? "rgb(255, 255, 255) 0px 0px 0px 2px" : "none"
        );
        cy.get("#node_1").should(
            "have.css",
            "box-shadow",
            node1Selected ? "rgb(255, 255, 255) 0px 0px 0px 2px" : "none"
        );
    };

    // Test function declaration section
    beforeEach(() => {
        mount(<SingleNodeNodeEditor />);
    });

    it("Node item can be selected", () => {
        clickNode("0", false);
        checkSelection(true, false, false, false);
    });

    it("Link item can be selected", () => {
        clickLink("0", false);
        checkSelection(false, false, true, false);
    });

    it("Node item can be selected and moved", () => {
        clickAndMoveNode("0", false);
        checkSelection(true, false, false, false);
    });

    it("Selected node item can be unselected using shift key", () => {
        clickNode("0", false);
        checkSelection(true, false, false, false);
        clickNode("0", true);
        checkSelection(false, false, false, false);
    });

    it("Selected node item can be unselected when other node is moved", () => {
        clickNode("0", false);
        checkSelection(true, false, false, false);
        clickAndMoveNode("1", false);
        checkSelection(false, true, false, false);
    });

    it("Selected link item can be unselected using shift key", () => {
        clickLink("0", false);
        checkSelection(false, false, true, false);
        clickLink("0", true);
        checkSelection(false, false, false, false);
    });

    it("Selected node keep selected when reclicked", () => {
        clickNode("0", false);
        checkSelection(true, false, false, false);
        clickNode("0", false);
        checkSelection(true, false, false, false);
    });

    it("Selected link keep selected when reclicked", () => {
        clickLink("0", false);
        checkSelection(false, false, true, false);
        clickLink("0", false);
        checkSelection(false, false, true, false);
    });

    it("Multiple item can be selected using shift", () => {
        clickNode("0", true);
        clickNode("1", true);
        clickLink("0", true);
        checkSelection(true, true, true, false);
    });

    it("Click panzoom without shift unset any selection", () => {
        clickNode("0", true);
        clickLink("0", true);
        checkSelection(true, false, true, false);
        clickPanZoom(false);
        checkSelection(false, false, false, false);
    });

    it("Click panzoom without shift does not alter selection", () => {
        clickNode("0", true);
        clickLink("0", true);
        checkSelection(true, false, true, false);
        clickPanZoom(true);
        checkSelection(true, false, true, false);
    });

    it("Move a node without shift key pressed and many node selected keep selection", () => {
        clickNode("0", false);
        clickLink("0", true);
        clickNode("1", true);
        checkSelection(true, true, true, false);
        clickAndMoveNode("0", false);
        checkSelection(true, true, true, false);
    });

    it("Move an unselected node with shift key pressed and existing selection, keep selection", () => {
        clickNode("0", false);
        clickLink("0", true);
        clickAndMoveNode("1", true);
        checkSelection(true, true, true, false);
    });

    it("Move an unselected node without shift key pressed and existing selection, delete selection", () => {
        clickNode("0", false);
        clickLink("0", true);
        checkSelection(true, false, true, false);
        clickAndMoveNode("1", false);
        checkSelection(false, true, false, false);
    });
});
