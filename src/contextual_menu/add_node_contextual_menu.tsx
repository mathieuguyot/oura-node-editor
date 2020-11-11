import React from "react";

import { Node, NodeModel, NodeCollection } from "../node_editor";
import { MenuItemProps } from "./common";
import { BasicContextualMenu } from "./basic_contextual_menu";

type NodePrevisualizerProps = {
    node: NodeModel | null;
};

const NodePrevisualizer = (props: NodePrevisualizerProps): JSX.Element => {
    const { node } = props;
    const previewDivRef = React.useRef<HTMLHeadingElement>(null);

    let nodeElem = null;
    if (node && previewDivRef && previewDivRef.current) {
        const divDim = previewDivRef.current.getBoundingClientRect();
        const displayedNode = { ...node };
        displayedNode.x = 10;
        displayedNode.width = divDim.width - 20;
        displayedNode.y = 10;
        nodeElem = node ? (
            <Node
                nodeId="0"
                getZoom={() => 1}
                isNodeSelected
                node={displayedNode}
                onConnectorUpdate={() => null}
            />
        ) : null;
    }

    return (
        <div
            ref={previewDivRef}
            style={{
                position: "relative",
                gridArea: "preview",
                overflow: "hidden",
                width: 200,
                height: 200
            }}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>{nodeElem}</div>
        </div>
    );
};

export type AddNodeContextualMenuProps = {
    nodesSchema: NodeCollection;
    onNodeSelection: (id: string) => void;
};

export const AddNodeContextualMenu = (props: AddNodeContextualMenuProps): JSX.Element => {
    const { nodesSchema, onNodeSelection } = props;

    const [previsualizedNodeId, setPrevisualizedNodeId] = React.useState<string>("");

    const items: { [id: string]: MenuItemProps } = {};
    Object.keys(nodesSchema).forEach((id) => {
        items[id] = {
            name: nodesSchema[id].name,
            description: "Need this...",
            onMouseEnter: () => {
                setPrevisualizedNodeId(id);
            },
            onMouseLeave: () => {
                setPrevisualizedNodeId("");
            },
            onClick: () => {
                onNodeSelection(id);
            }
        };
    });

    return (
        <>
            <BasicContextualMenu menuTitle="Add a new node" items={items} />
            <NodePrevisualizer
                node={previsualizedNodeId ? nodesSchema[previsualizedNodeId] : null}
            />
        </>
    );
};
