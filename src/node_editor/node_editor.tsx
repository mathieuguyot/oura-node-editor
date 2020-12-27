import React, { Component } from "react";
import { produce, enableMapSet } from "immer";
import _ from "lodash";

import {
    LinkModel,
    LinkPositionModel,
    arePositionEquals,
    PanZoomModel,
    ConnectorModel,
    NodeCollection,
    LinkCollection,
    SelectionItem,
    PinSide,
    NodePinPositions
} from "./model";
import PanZoom from "./pan_zoom";
import BackGround from "./background";
import LinkCanvas from "./link_canvas";
import NodeCanvas from "./node_canvas";
import { ThemeContext, darkTheme, ThemeContextType } from "./theme";

enableMapSet();

type NodeEditorProps = {
    nodes: NodeCollection;
    links: LinkCollection;
    panZoomInfo: PanZoomModel;
    selectedItems: Array<SelectionItem>;
    theme?: ThemeContextType;

    onNodeMove?(id: string, newX: number, newY: number, newWidth: number): void;
    onCreateLink?(link: LinkModel): void;
    onConnectorUpdate?: (nodeId: string, cId: string, connector: ConnectorModel) => void;

    onPanZoomInfo: (panZoomInfo: PanZoomModel) => void;
    onSelectedItems: (selection: Array<SelectionItem>) => void;
};

type NodeEditorState = {
    linksPositions: { [linkId: string]: LinkPositionModel };
    draggedLink?: LinkPositionModel;
};

class NodeEditor extends Component<NodeEditorProps, NodeEditorState> {
    private nodesPinPositions: { [nodeId: string]: NodePinPositions } = {};

    constructor(props: NodeEditorProps) {
        super(props);
        this.state = {
            linksPositions: {}
        };

        this.getZoom = this.getZoom.bind(this);
        this.onUpdatePreviewLink = this.onUpdatePreviewLink.bind(this);
        this.onNodePinPositionsUpdate = this.onNodePinPositionsUpdate.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
        this.onCreateLink = this.onCreateLink.bind(this);
        this.onConnectorUpdate = this.onConnectorUpdate.bind(this);
        this.onNodeMove = this.onNodeMove.bind(this);
    }

    componentDidMount(): void {
        this.updateLinkPositions();
    }

    componentDidUpdate(): void {
        this.updateLinkPositions();
    }

    onSelectItem(selection: SelectionItem | null, shiftKey: boolean): void {
        const { selectedItems, onSelectedItems } = this.props;
        if (!selection && !shiftKey) {
            onSelectedItems([]);
        } else if (selection && shiftKey && _.some(selectedItems, selection)) {
            const newSelection = [...selectedItems];
            let indexToDelete = -1;
            selectedItems.forEach((item, index) => {
                if (item.id === selection.id && item.type === selection.type) {
                    indexToDelete = index;
                }
            });
            if (indexToDelete !== -1) {
                newSelection.splice(indexToDelete, 1);
            }
            onSelectedItems(newSelection);
        } else if (selection && !_.some(selectedItems, selection)) {
            let newSelection = [...selectedItems];
            if (!shiftKey) {
                newSelection = [];
            }
            newSelection.push(selection);
            onSelectedItems(newSelection);
        }
        if (!shiftKey && selection) {
            onSelectedItems([selection]);
        }
    }

    onUpdatePreviewLink(previewLink?: LinkPositionModel): void {
        this.setState({
            draggedLink: previewLink
        });
    }

    onNodePinPositionsUpdate(nodeId: string, pinPositions: NodePinPositions): void {
        this.nodesPinPositions[nodeId] = pinPositions;
    }

    onCreateLink(link: LinkModel): void {
        const { onCreateLink } = this.props;
        if (
            onCreateLink &&
            link.inputPinSide !== link.outputPinSide &&
            link.inputNodeId !== link.outputNodeId
        ) {
            onCreateLink(link);
        }
    }

    onNodeMove(id: string, newX: number, newY: number, newWidth: number): void {
        const { onNodeMove } = this.props;
        if (onNodeMove) {
            onNodeMove(id, newX, newY, newWidth);
        }
    }

    onConnectorUpdate(nodeId: string, cId: string, connector: ConnectorModel): void {
        const { onConnectorUpdate } = this.props;
        if (onConnectorUpdate) {
            onConnectorUpdate(nodeId, cId, connector);
        }
    }

    getZoom(): number {
        const { panZoomInfo } = this.props;
        return panZoomInfo.zoom;
    }

    updateLinkPositions(): void {
        const { links } = this.props;
        const { linksPositions } = this.state;
        let redrawPinPosition = false;
        const newLinksPositions = produce(linksPositions, (draft) => {
            // Create or update position of all links positions that need so
            Object.keys(links).forEach((key) => {
                const link = links[key];
                if (
                    link.inputNodeId in this.nodesPinPositions === false ||
                    link.outputNodeId in this.nodesPinPositions === false
                ) {
                    return;
                }
                const iNPins = this.nodesPinPositions[link.inputNodeId][link.inputPinId];
                const oNPins = this.nodesPinPositions[link.outputNodeId][link.outputPinId];
                if (iNPins && oNPins) {
                    const inputPinPosition = iNPins[link.inputPinSide === PinSide.LEFT ? 0 : 1];
                    const outputPinPosition = oNPins[link.outputPinSide === PinSide.LEFT ? 0 : 1];
                    if (inputPinPosition && outputPinPosition) {
                        if (
                            !(key in draft) ||
                            !arePositionEquals(draft[key].inputPinPosition, inputPinPosition) ||
                            !arePositionEquals(draft[key].outputPinPosition, outputPinPosition)
                        ) {
                            draft[key] = { linkId: key, inputPinPosition, outputPinPosition };
                            redrawPinPosition = true;
                        }
                    }
                }
            });
            // Remove link positions that belongs to a deleted links
            Object.keys(linksPositions).forEach((key) => {
                if (!(key in links)) {
                    delete draft[key];
                    redrawPinPosition = true;
                }
            });
        });
        if (redrawPinPosition) {
            this.setState({
                linksPositions: newLinksPositions
            });
        }
    }

    render(): JSX.Element {
        const { nodes, links, selectedItems, panZoomInfo, theme } = this.props;
        const { onPanZoomInfo } = this.props;
        const { draggedLink, linksPositions } = this.state;

        return (
            <ThemeContext.Provider value={theme || darkTheme}>
                <BackGround panZoomInfo={panZoomInfo}>
                    <PanZoom
                        panZoomInfo={panZoomInfo}
                        onPanZoomInfo={onPanZoomInfo}
                        onSelectItem={this.onSelectItem}>
                        <LinkCanvas
                            links={links}
                            linksPositions={linksPositions}
                            draggedLink={draggedLink}
                            selectedItems={selectedItems}
                            onSelectItem={this.onSelectItem}
                        />
                        <NodeCanvas
                            nodes={nodes}
                            getZoom={this.getZoom}
                            onNodeMove={this.onNodeMove}
                            onCreateLink={this.onCreateLink}
                            onUpdatePreviewLink={this.onUpdatePreviewLink}
                            onConnectorUpdate={this.onConnectorUpdate}
                            onNodePinPositionsUpdate={this.onNodePinPositionsUpdate}
                            selectedItems={selectedItems}
                            onSelectItem={this.onSelectItem}
                        />
                    </PanZoom>
                </BackGround>
            </ThemeContext.Provider>
        );
    }
}

export default NodeEditor;
