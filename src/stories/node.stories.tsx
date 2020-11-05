/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import "../index.css";

import { Node, NodeProps } from "../node_editor/node";
import { PinLayout } from "../node_editor/model";

export default {
    title: "Test/Node",
    component: Node
} as Meta;

const defaultProps: NodeProps = {
    nodeId: "0",
    node: {
        name: "default_node",
        x: 0,
        y: 0,
        connectors: {},
        width: 200
    },
    isNodeSelected: false,

    getZoom: () => {
        return 1;
    },

    onConnectorUpdate: () => null,

    onNodeMoveStart: () => null,
    onNodeMove: () => null,
    onNodeMoveEnd: () => null,
    onCreateLink: () => null,
    onUpdatePreviewLink: () => null
};

const Template: Story<NodeProps> = (args) => (
    <div
        style={{
            position: "relative",
            backgroundColor: "red",
            top: 0,
            left: 0,
            width: "100%"
        }}>
        <Node {...args} />
    </div>
);

export const EmptyNode = Template.bind({});
EmptyNode.args = { ...defaultProps };

export const BasicUnselectedNode = Template.bind({});
BasicUnselectedNode.args = { ...defaultProps };
BasicUnselectedNode.args.node = {
    name: "full_node",
    x: 0,
    y: 0,
    connectors: {
        0: { name: "x", pinLayout: PinLayout.LEFT_PIN, data: {} },
        1: { name: "y", pinLayout: PinLayout.LEFT_PIN, contentType: "string", data: {} },
        2: { name: "z", pinLayout: PinLayout.LEFT_PIN, data: {} },
        3: { name: "sum", pinLayout: PinLayout.RIGHT_PIN, data: {} },
        4: { name: "product", pinLayout: PinLayout.RIGHT_PIN, data: {} }
    },
    width: 300
};

export const BasicSelectedNode = Template.bind({});
BasicSelectedNode.args = { ...BasicUnselectedNode.args };
BasicSelectedNode.args.isNodeSelected = true;
