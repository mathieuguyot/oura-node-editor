import React from "react";
import { mount } from "cypress-react-unit-test";
import produce from "immer";
import { NodeEditor, LinkModel, PinLayout } from "../../src/node_editor";
import "../../src/index.css";

const SingleNodeNodeEditor = (): JSX.Element => {
    const [nodes, setNodes] = React.useState({
        node_a: {
            id: "node_a",
            name: "my tested node",
            width: 200,
            x: 30,
            y: 30,
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

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <NodeEditor
                nodes={nodes}
                links={links}
                onNodeMove={onNodeMove}
                onCreateLink={onCreateLink}
            />
        </div>
    );
};

describe("Node component", () => {
    beforeEach(() => {
        mount(<SingleNodeNodeEditor />);
    });

    it("can be dragged", () => {
        let begginCords = null;
        // Get node element
        const node = cy.contains("my tested node").should("exist");
        // Save its initial position
        node.then((elem) => {
            begginCords = elem[0].getBoundingClientRect();
        });
        // Move it
        node.trigger("mousedown", { force: true })
            .trigger("mousemove", 200, 200, { force: true })
            .trigger("mouseup");
        // Compare with final position
        node.then((elem) => {
            const endCords = elem[0].getBoundingClientRect();
            if (endCords.x <= begginCords.x || endCords.y <= begginCords.y) {
                throw new Error("Node was not moved successfully");
            }
        });
    });

    it("can be resized", () => {
        let begginCords = null;
        // Get node element
        const node = cy.contains("my tested node").should("exist");
        const footer = node.parent().parent().children().last();
        // Save its initial position
        node.then((elem) => {
            begginCords = elem[0].getBoundingClientRect();
        });
        // Move it
        footer
            .trigger("mousedown", { force: true })
            .trigger("mousemove", 200, 200, { force: true })
            .trigger("mouseup");
        // Compare with final position
        node.then((elem) => {
            const endCords = elem[0].getBoundingClientRect();
            if (
                endCords.width <= begginCords.width ||
                endCords.x !== begginCords.x ||
                endCords.y !== begginCords.y
            ) {
                throw new Error("Node was not resized successfully");
            }
        });
    });
});
