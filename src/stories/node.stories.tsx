import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { Node, NodeProps } from '../node_editor/node';
import { ConnectorModel, XYPosition, ConnectorType } from '../node_editor/model';

export default {
  title: 'Test/Node',
  component: Node,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const default_props : NodeProps = {
    node: {
        name: "default_node",
        nId: 0,
        x: 0,
        y: 0,
        connectors: [],
        width: 200
    },
    getZoom: () => {return 1},

    onNodeMoveStart: (nId: number) => {},
    onNodeMove: (nId: number, offsetX: number, offsetY: number, width: number) => {},
    onNodeMoveEnd: (nId: number) => {},

    onConnectorDragStart: (nId: number, connectorModel: ConnectorModel, draggedPinPosition: XYPosition) => {},
    onConnectorMouseMove: (draggedPinNewPosition: XYPosition) => {},
    onConnectorMouseUp: () => {},
    onMouseOverConnector: (nId: number, connectorModel: ConnectorModel, pinPosition: XYPosition) => {},
    onMouseLeavesConnector: (mousePosition: XYPosition) => {}

}

const Template: Story<NodeProps> = (args) => <div style={{position: "relative", backgroundColor:"red", top: 0, left: 0, width: "100%"}}>
    <Node {...args} />
</div>;

export const EmptyNode = Template.bind({});
EmptyNode.args = {...default_props};

export const FullNode = Template.bind({});
FullNode.args = {...default_props};
FullNode.args.node = {
    name: "full_node",
    nId: 0,
    x: 0,
    y: 0,
    connectors: [
        {id:0, name:"x", connectorType: ConnectorType.Input},
        {id:1, name:"y", connectorType: ConnectorType.Input, contentType: "string"},
        {id:2, name:"z", connectorType: ConnectorType.Input},
        {id:4, name:"sum", connectorType: ConnectorType.Output},
        {id:5, name:"product", connectorType: ConnectorType.Output},
    ],
    width: 300
};