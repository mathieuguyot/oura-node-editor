import { generateUuid, NodeCollection, LinkCollection, PinSide } from "../../node_editor";
import RectangleNode from "./nodes/rectangle";

export function dumbNodeCreator(): NodeCollection {
    const nodes: NodeCollection = {};
    for (let index = 0; index < 10; index += 1) {
        const rectNode = new RectangleNode();
        rectNode.name = `${rectNode.name}_${index}`;
        rectNode.x = Math.floor(Math.random() * 5000);
        rectNode.y = Math.floor(Math.random() * 5000);
        nodes[index.toString()] = rectNode;
    }
    return nodes;
}

export function dumbLinkCreator(nodes: NodeCollection): LinkCollection {
    const links: LinkCollection = {};

    Object.keys(nodes).forEach((inputKey) => {
        Object.keys(nodes).forEach((outputKey) => {
            if (inputKey !== outputKey) {
                links[generateUuid()] = {
                    inputNodeId: inputKey,
                    inputPinSide: PinSide.RIGHT,
                    inputPinId: "0",
                    outputNodeId: outputKey,
                    outputPinSide: PinSide.LEFT,
                    outputPinId: (Math.floor(Math.random() * 4) + 1).toString()
                };
            }
        });
    });

    return links;
}
