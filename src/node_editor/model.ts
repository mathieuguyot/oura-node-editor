/* eslint-disable no-bitwise */
export interface XYPosition {
    x: number;
    y: number;
}

export interface PanZoomModel {
    zoom: number;
    topLeftCorner: XYPosition;
}

export function arePositionEquals(rPos: XYPosition, lPos: XYPosition): boolean {
    return rPos.x === lPos.x && rPos.y === lPos.y;
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

export interface LinkPositionModel {
    linkId: string;
    inputPinPosition: XYPosition;
    outputPinPosition: XYPosition;
}

export function generateUuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export interface NodeModel {
    name: string;
    x: number;
    y: number;
    width: number;
    connectors: { [cId: string]: ConnectorModel };
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
    name: string;
    pinLayout: PinLayout;
    contentType?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}
