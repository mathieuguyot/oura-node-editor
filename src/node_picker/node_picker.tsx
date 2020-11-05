import React from "react";
import { NodeModel, Node } from "../node_editor";

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
                overflow: "hidden"
            }}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>{nodeElem}</div>
        </div>
    );
};

type NodePickerProps = {
    nodesSchema: { [id: string]: NodeModel };
    onNodeSelection: (id: string) => void;
};

const NodePicker = (props: NodePickerProps): JSX.Element => {
    const { nodesSchema, onNodeSelection } = props;

    const [searchText, setSearchText] = React.useState<string>("");
    const [previsualizedNodeId, setPrevisualizedNodeId] = React.useState<string>("");

    const onChange = React.useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            setSearchText(event.currentTarget.value);
        },
        [previsualizedNodeId]
    );

    const onMouseEnter = React.useCallback(
        (id: string) => {
            if (previsualizedNodeId !== id) {
                setPrevisualizedNodeId(id);
            }
        },
        [previsualizedNodeId]
    );

    const onMouseLeaves = React.useCallback(() => {
        setPrevisualizedNodeId("");
    }, [previsualizedNodeId]);

    const onMouseDown = React.useCallback(
        (id: string) => {
            onNodeSelection(id);
        },
        [onNodeSelection]
    );

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "0.2fr 1.8fr",
                gridTemplateAreas: "'input input' 'list preview'"
            }}>
            <input
                style={{ gridArea: "input" }}
                value={searchText}
                onChange={onChange}
                placeholder="Search a node here"
            />
            <div
                style={{
                    gridArea: "list",
                    overflowY: "scroll",
                    overflowX: "hidden"
                }}>
                {Object.keys(nodesSchema).map((id) => {
                    if (!nodesSchema[id].name.toUpperCase().includes(searchText.toUpperCase())) {
                        return null;
                    }
                    return (
                        <div
                            style={{
                                paddingTop: 5,
                                paddingBottom: 5,
                                textAlign: "center"
                            }}
                            onMouseEnter={onMouseEnter.bind(this, id)}
                            onMouseLeave={onMouseLeaves}
                            onMouseDown={onMouseDown.bind(this, id)}
                            key={id}>
                            {nodesSchema[id].name}
                        </div>
                    );
                })}
            </div>
            <NodePrevisualizer
                node={previsualizedNodeId ? nodesSchema[previsualizedNodeId] : null}
            />
        </div>
    );
};

export default NodePicker;
