import React from "react";

import { Node, NodeModel, NodeCollection, ConnectorContentProps } from "../node_editor";
import { MenuItemProps } from "./common";
import { BasicContextualMenu } from "./basic_contextual_menu";

type NodePrevisualizerProps = {
    node: NodeModel | null;
    createCustomConnectorComponent: (props: ConnectorContentProps) => JSX.Element | null;
};

const NodePrevisualizer = (props: NodePrevisualizerProps): JSX.Element => {
    const { node, createCustomConnectorComponent } = props;
    const previewDivRef = React.useRef<HTMLHeadingElement>(null);

    let nodeElem: JSX.Element | null = null;
    if (node && previewDivRef && previewDivRef.current) {
        const divDim = previewDivRef.current.getBoundingClientRect();
        const displayedNode = { ...node };
        displayedNode.position = { x: 10, y: 10 };
        displayedNode.width = divDim.width - 20;
        nodeElem = node ? (
            <Node
                nodeId="0"
                getZoom={() => 1}
                isNodeSelected
                node={displayedNode}
                onConnectorUpdate={() => null}
                onNodePinPositionsUpdate={() => null}
                onNodeHeightUpdate={() => null}
                createCustomConnectorComponent={createCustomConnectorComponent}
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
                width: "600px",
                height: "500px"
            }}
        >
            {nodeElem}
        </div>
    );
};

export type AddNodeContextualMenuProps = {
    nodesSchema: NodeCollection;
    onNodeSelection: (id: string) => void;
    onMouseHover: (isMouseHover: boolean) => void;
    createCustomConnectorComponent: (props: ConnectorContentProps) => JSX.Element | null;
};

export const AddNodeContextualMenu = (props: AddNodeContextualMenuProps): JSX.Element => {
    const { nodesSchema, onNodeSelection, createCustomConnectorComponent, onMouseHover } = props;

    const [previsualizedNodeId, setPrevisualizedNodeId] = React.useState<string>("");

    const items: { [id: string]: [MenuItemProps] } = {};
    Object.keys(nodesSchema).forEach((id) => {
        const newItem = {
            name: nodesSchema[id].name,
            category: nodesSchema[id].category,
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
        const categoryName = nodesSchema[id].category
            ? (nodesSchema[id].category as string)
            : "no category";
        if (categoryName in items) {
            items[categoryName].push(newItem);
        } else {
            items[categoryName] = [newItem];
        }
    });

    const onMouseEnter = React.useCallback(() => {
        onMouseHover(true);
    }, [onMouseHover]);

    const onMouseLeaves = React.useCallback(() => {
        onMouseHover(false);
    }, [onMouseHover]);

    return (
        <div className="one-flex" onMouseLeave={onMouseLeaves} onMouseEnter={onMouseEnter}>
            <div className="one-bg-primary">
                <BasicContextualMenu menuTitle="Add a new node" items={items} />
            </div>
            <NodePrevisualizer
                node={previsualizedNodeId ? nodesSchema[previsualizedNodeId] : null}
                createCustomConnectorComponent={createCustomConnectorComponent}
            />
        </div>
    );
};
