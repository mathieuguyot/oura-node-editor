/* eslint-disable no-bitwise */

export interface SelectionItem {
    id: string;
    type: string;
}

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
    inputPinSide: PinSide;
    outputNodeId: string;
    outputPinId: string;
    outputPinSide: PinSide;
    linkType?: string;
}

export type LinkCollection = { [id: string]: LinkModel };
export type ConnectorCollection = { [cId: string]: ConnectorModel };

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
    position: XYPosition;
    width: number;
    connectors: ConnectorCollection;
}

export type NodeCollection = { [id: string]: NodeModel };

export enum PinSide {
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
    contentType: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

export type PinPosition = XYPosition | null;
export type NodePinPositions = { [cId: string]: Array<PinPosition> };
