export interface XYPosition {
    x: number;
    y: number;
}

export interface LinkModel {
    inputNodeId: string;
    inputPinId: string;
    inputPinType: PinType;
    outputNodeId: string;
    outputPinId: string;
    outputPinType: PinType;
    linkType?: string;
}

export function getLinkId(link: LinkModel): string {
    return `${link.inputNodeId}.${link.inputPinId}->${link.outputNodeId}${link.outputPinId}__${link.linkType}`;
}

export interface LinkPositionModel {
    linkId: string;
    inputPinPosition: XYPosition;
    outputPinPosition: XYPosition;
}

export interface NodeModel {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    connectors: ConnectorModel[];
}

export enum PinType {
    LEFT,
    RIGHT
}

export enum PinLayout {
    NO_PINS,
    LEFT_PIN,
    RIGHT_PIN,
    BOTH_PINS
}

export interface ConnectorModel {
    id: string;
    name: string;
    pinLayout: PinLayout;
    contentType?: string;
}
