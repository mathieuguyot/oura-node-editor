/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import "../index.css";

import { AddNodeContextualMenu, AddNodeContextualMenuProps } from "../contextual_menu";
import { PinLayout } from "../node_editor";

export default {
    title: "Test/Add-node-contextual-menu",
    component: AddNodeContextualMenu
} as Meta;

const defaultProps: AddNodeContextualMenuProps = {
    nodesSchema: {
        rectangle: {
            name: "rectangle",
            width: 100,
            x: 0,
            y: 0,
            connectors: {
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
            }
        }
    },
    onNodeSelection: () => null
};

const Template: Story<AddNodeContextualMenuProps> = (args) => (
    <div
        style={{
            position: "relative",
            top: 0,
            left: 0,
            width: "100%"
        }}>
        <AddNodeContextualMenu {...args} />
    </div>
);

export const Menu = Template.bind({});
Menu.args = { ...defaultProps };
