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
                width: 200,
                height: 200
            }}
        >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>{nodeElem}</div>
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

    const items: { [id: string]: MenuItemProps } = {};
    Object.keys(nodesSchema).forEach((id) => {
        items[id] = {
            name: nodesSchema[id].name,
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

    const onMouseEnter = React.useCallback(() => {
        onMouseHover(true);
    }, [onMouseHover]);

    const onMouseLeaves = React.useCallback(() => {
        onMouseHover(false);
    }, [onMouseHover]);

    return (
        <div onMouseLeave={onMouseLeaves} onMouseEnter={onMouseEnter}>
            <BasicContextualMenu menuTitle="Add a new node" items={items} />
            <NodePrevisualizer
                node={previsualizedNodeId ? nodesSchema[previsualizedNodeId] : null}
                createCustomConnectorComponent={createCustomConnectorComponent}
            />
        </div>
    );
};
