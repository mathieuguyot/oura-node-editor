import React from "react";
import { mount } from "@cypress/react";
import produce from "immer";
import { NodeEditor, LinkModel, PinLayout } from "../../src/node_editor";
import "../../src/index.css";
import {
    PanZoomModel,
    generateUuid,
    NodeCollection,
    LinkCollection,
    SelectionItem
} from "../../src/node_editor/model";

const SingleNodeNodeEditor = (props: { initialZoom: number }): JSX.Element => {
    const { initialZoom } = props;
    const [selectedItems, setSelectedItems] = React.useState<SelectionItem[]>([]);
    const [panZoomInfo, setPanZoomInfo] = React.useState<PanZoomModel>({
        zoom: initialZoom,
        topLeftCorner: { x: 0, y: 0 }
    });
    const [nodes, setNodes] = React.useState<NodeCollection>({
        0: {
            name: "my tested node",
            width: 200,
            position: { x: 100, y: 100 },
            connectors: {
                0: { name: "x", pinLayout: PinLayout.LEFT_PIN, contentType: "none", data: {} },
                1: { name: "y", pinLayout: PinLayout.LEFT_PIN, contentType: "none", data: {} }
            }
        }
    });
    const [links, setLinks] = React.useState<LinkCollection>({});

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

    const onCreateLink = React.useCallback(
        (link: LinkModel) => {
            const newLinks = produce(links, (draft) => {
                draft[generateUuid()] = link;
            });
            setLinks(newLinks);
        },
        [links]
    );

    return (
        <div style={{ width: "100%", height: "100vh" }} id="root">
            <NodeEditor
                panZoomInfo={panZoomInfo}
                onPanZoomInfo={setPanZoomInfo}
                nodes={nodes}
                links={links}
                onNodeMove={onNodeMove}
                onCreateLink={onCreateLink}
                selectedItems={selectedItems}
                onSelectedItems={setSelectedItems}
            />
        </div>
    );
};

const zoomFactors = [0.5, 1, 1.5];

zoomFactors.forEach((zoom) => {
    describe(`Node component (zoom factor: ${zoom})`, () => {
        beforeEach(() => {
            mount(<SingleNodeNodeEditor initialZoom={zoom} />);
        });

        it("can be dragged", () => {
            // Get node element
            const dragX = 300;
            const dragY = 300;
            const node = cy.contains("my tested node").should("exist");
            // Save its initial position
            node.then((elem) => {
                const begginCords = elem[0].getBoundingClientRect();
                // Move it
                node.trigger("mousedown", "topLeft", { force: true })
                    .trigger("mousemove", "topLeft", {
                        force: true,
                        pageX: begginCords.x + dragX,
                        pageY: begginCords.y + dragY
                    })
                    .trigger("mouseup", { force: true });
                // Compare with final position + width
                node.then((endElem) => {
                    const endCords = endElem[0].getBoundingClientRect();
                    if (
                        endCords.x !== begginCords.x + dragX ||
                        endCords.y !== begginCords.y + dragY ||
                        endCords.width !== begginCords.width
                    ) {
                        throw new Error("Node was not moved successfully");
                    }
                });
            });
        });

        it("can be resized", () => {
            // Get node element
            const dragX = 300;
            const dragY = 200;
            const node = cy.contains("my tested node").should("exist");
            const footer = node.parent().children().last();
            // Save its initial position
            node.then((elem) => {
                const begginCords = elem[0].getBoundingClientRect();
                // Move the footer to resize the node
                footer
                    .trigger("mousedown", "topLeft", { force: true })
                    .trigger("mousemove", "topLeft", {
                        force: true,
                        pageX: begginCords.x + dragX,
                        pageY: begginCords.y + dragY
                    })
                    .trigger("mouseup", { force: true });
                // Compare with final position + width
                node.then((elemElem) => {
                    const endCords = elemElem[0].getBoundingClientRect();
                    if (
                        endCords.width !== begginCords.width + dragX ||
                        endCords.x !== begginCords.x ||
                        endCords.y !== begginCords.y
                    ) {
                        throw new Error("Node was not resized successfully");
                    }
                });
            });
        });
    });
});
