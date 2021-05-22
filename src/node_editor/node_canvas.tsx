import React from "react";
import _ from "lodash";

import {
    ConnectorModel,
    LinkModel,
    LinkPositionModel,
    NodeCollection,
    NodePinPositions,
    SelectionItem
} from "./model";
import { Node } from "./node";
import { ConnectorContentProps } from "./connector_content";

export interface NodeCanvasProps {
    nodes: NodeCollection;
    selectedItems: Array<SelectionItem>;

    onSelectItem: (selection: SelectionItem | null, shiftKey: boolean) => void;
    onUpdatePreviewLink: (previewLink?: LinkPositionModel) => void;
    getZoom: () => number;

    onNodeMove: (id: string, newX: number, newY: number, newWidth: number) => void;
    onCreateLink?: (link: LinkModel) => void;
    onConnectorUpdate: (nodeId: string, cId: string, connector: ConnectorModel) => void;
    onNodePinPositionsUpdate: (nodeId: string, pinPositions: NodePinPositions) => void;

    createCustomConnectorComponent?(props: ConnectorContentProps): JSX.Element | null;
}

export default class NodeEditor extends React.Component<NodeCanvasProps> {
    private lastSettedSelection: SelectionItem | undefined;

    constructor(props: NodeCanvasProps) {
        super(props);

        this.onNodeMoveStart = this.onNodeMoveStart.bind(this);
        this.onNodeMove = this.onNodeMove.bind(this);
        this.onNodeMoveEnd = this.onNodeMoveEnd.bind(this);
    }

    onNodeMoveStart(id: string, shiftKey: boolean): void {
        const { selectedItems, onSelectItem } = this.props;
        const selection = { id, type: "node" };
        let alreadySelected = false;
        selectedItems.forEach((item) => {
            if (item.id === selection.id && item.type === selection.type) {
                alreadySelected = true;
            }
        });
        if (alreadySelected) {
            return;
        }
        this.lastSettedSelection = selection;
        selectedItems.forEach((item) => {
            if (item.id === id && item.type === "node") {
                this.lastSettedSelection = undefined;
            }
        });
        if (shiftKey && this.lastSettedSelection) {
            onSelectItem(selection, shiftKey);
        }
        if (!shiftKey) {
            onSelectItem(selection, shiftKey);
        }
    }

    onNodeMove(offsetX: number, offsetY: number, offsetWidth: number): void {
        const { selectedItems } = this.props;
        // Move each selected node
        selectedItems.forEach((item) => {
            if (item.type === "node") {
                const { nodes, onNodeMove } = this.props;
                const newX = nodes[item.id].position.x + offsetX;
                const newY = nodes[item.id].position.y + offsetY;
                const newWidth = nodes[item.id].width + offsetWidth;
                onNodeMove(item.id, newX, newY, newWidth > 100 ? newWidth : 100);
            }
        });
    }

    onNodeMoveEnd(id: string, wasNodeMoved: boolean, shiftKey: boolean): void {
        const { onSelectItem } = this.props;
        const selection = { id, type: "node" };
        if (!wasNodeMoved && !shiftKey) {
            onSelectItem(selection, shiftKey);
        } else if (!wasNodeMoved && shiftKey && !_.isEqual(selection, this.lastSettedSelection)) {
            onSelectItem(selection, shiftKey);
        }
        this.lastSettedSelection = undefined;
    }

    render(): JSX.Element {
        const { nodes, selectedItems } = this.props;
        const { getZoom, onCreateLink, onUpdatePreviewLink, onNodePinPositionsUpdate } = this.props;
        const { onConnectorUpdate, createCustomConnectorComponent } = this.props;

        return (
            <>
                {Object.keys(nodes).map((key) => (
                    <Node
                        nodeId={key}
                        key={key}
                        node={nodes[key]}
                        isNodeSelected={_.some(selectedItems, { id: key, type: "node" })}
                        getZoom={getZoom}
                        onNodeMoveStart={this.onNodeMoveStart}
                        onNodeMove={this.onNodeMove}
                        onNodeMoveEnd={this.onNodeMoveEnd}
                        onCreateLink={onCreateLink}
                        onUpdatePreviewLink={onUpdatePreviewLink}
                        onNodePinPositionsUpdate={onNodePinPositionsUpdate}
                        onConnectorUpdate={onConnectorUpdate}
                        createCustomConnectorComponent={createCustomConnectorComponent}
                    />
                ))}
            </>
        );
    }
}
