import React from "react";
import { mount } from "cypress-react-unit-test";
import produce from "immer";
import { NodeEditor, LinkModel, PinLayout } from "../../src/node_editor";
import "../../src/index.css";

const SingleNodeNodeEditor = (props: { zoom: number }): JSX.Element => {
    const [nodes, setNodes] = React.useState({
        node_a: {
            id: "node_a",
            name: "my tested node",
            width: 200,
            x: 100,
            y: 100,
            connectors: [
                { id: "0", name: "x", pinLayout: PinLayout.LEFT_PIN },
                { id: "1", name: "y", pinLayout: PinLayout.LEFT_PIN }
            ]
        }
    });
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
    const { zoom } = props;
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <NodeEditor
                zoom={zoom}
                setZoom={() => ({})}
                nodes={nodes}
                links={links}
                onNodeMove={onNodeMove}
                onCreateLink={onCreateLink}
            />
        </div>
    );
};

const zoomFactors = [0.5, 1, 1.5];

zoomFactors.forEach((zoom) => {
    describe(`Node component (zoom factor: ${zoom})`, () => {
        beforeEach(() => {
            mount(<SingleNodeNodeEditor zoom={zoom} />);
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
            const footer = node.parent().parent().children().last();
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
