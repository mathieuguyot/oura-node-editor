/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import "../index.css";

import { BasicContextualMenu, BasicContextualMenuProps } from "../contextual_menu";

export default {
    title: "Test/Basic-contextual-menu",
    component: BasicContextualMenu
} as Meta;

const defaultProps: BasicContextualMenuProps = {
    menuTitle: "Sample contextual menu",
    items: {
        delete_node: {
            name: "Delete selected node(s)",
            description: "Delete selected node(s) and associated links",
            onClick: () => null,
            onMouseEnter: () => null,
            onMouseLeave: () => null
        },
        delete_links: {
            name: "Delete selected link(s)",
            description: "Delete selected link(s)",
            onClick: () => null,
            onMouseEnter: () => null,
            onMouseLeave: () => null
        }
    }
};

const Template: Story<BasicContextualMenuProps> = (args) => (
    <div
        style={{
            position: "relative",
            top: 0,
            left: 0,
            width: "100%"
        }}>
        <BasicContextualMenu {...args} />
    </div>
);

export const Menu = Template.bind({});
Menu.args = { ...defaultProps };
