export interface XYPosition {
    x: number;
    y: number;
}

export interface LinkModel {
    inputNodeId: number;
    inputPinId: number;
    ouputNodeId: number;
    outputPinId: number;
    inputPinPosition ?: XYPosition;
    outputPinPosition ?: XYPosition;
}

export interface NodeModel {
    nId: number;
    name: string;
    x: number;
    y: number;
    width: number;
    connectors: ConnectorModel[];
}

export enum ConnectorType {
    Input,
    Output
}

export interface ConnectorModel {
    id: number;
    name: string;
    connectorType: ConnectorType;
    contentType?: string;
}
