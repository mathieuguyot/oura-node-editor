/* eslint-disable @typescript-eslint/no-explicit-any */
import { immerable } from "immer";
import {
    ConnectorCollection,
    LinkCollection,
    LinkModel,
    NodeCollection,
    NodeModel,
    PinLayout,
    PinSide
} from "../../../node_editor";

const getLinks = (links: LinkCollection, nodeId: string, cId: string): Array<LinkModel> => {
    const validLinks: Array<LinkModel> = [];
    Object.keys(links).forEach((key) => {
        const link = links[key];
        if (
            (link.inputNodeId === nodeId && link.inputPinId === cId) ||
            (link.outputNodeId === nodeId && link.outputPinId === cId)
        ) {
            validLinks.push(link);
        }
    });
    return validLinks;
};

export default abstract class Node implements NodeModel {
    [immerable] = true;
    public name: string;
    public x = 0;
    public y = 0;
    public width: number;
    public connectors: ConnectorCollection;

    constructor(name: string, width: number, connectors: ConnectorCollection) {
        this.name = name;
        this.width = width;
        this.connectors = connectors;
    }

    compute(nodes: NodeCollection, links: LinkCollection): { [id: string]: any } {
        const nodeId = Object.keys(nodes).find((key) => nodes[key] === this);
        if (nodeId) {
            const inputs: { [id: string]: any } = {};
            Object.keys(this.connectors).forEach((key) => {
                const connector = this.connectors[key];
                if (
                    connector.pinLayout === PinLayout.LEFT_PIN ||
                    connector.pinLayout === PinLayout.BOTH_PINS
                ) {
                    const otherLinks = getLinks(links, nodeId, key);
                    otherLinks.forEach((link) => {
                        const otherNodeId =
                            link.inputNodeId !== nodeId ? link.inputNodeId : link.outputNodeId;
                        const otherConnectorId =
                            link.inputNodeId === otherNodeId ? link.inputPinId : link.outputPinId;
                        const otherPinSide =
                            link.inputNodeId === otherNodeId
                                ? link.inputPinSide
                                : link.outputPinSide;
                        if (
                            otherPinSide === PinSide.LEFT &&
                            connector.pinLayout === PinLayout.BOTH_PINS
                        ) {
                            return;
                        }
                        const otherNode = nodes[otherNodeId];
                        const res = (otherNode as Node).compute(nodes, links);
                        if (!(key in inputs)) {
                            inputs[key] = [];
                        }
                        inputs[key].push(res[otherConnectorId]);
                    });
                }
            });
            return this.computeSpecific(inputs);
        }
        return {};
    }

    protected abstract computeSpecific(inputs: { [id: string]: any }): { [id: string]: any };
}
