import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import "../index.css";

import NodeEditor from "../node_editor/node_editor";

export default {
    title: "Playground/Node Editor",
    component: NodeEditor,
} as Meta;

const Template: Story = (args) => <div style={{position: "relative", top: 0, left: 0, width: "100%", height: "95vh"}}>
    <NodeEditor {...args} />
</div>;

export const RandomNodeEditor = Template.bind({});
