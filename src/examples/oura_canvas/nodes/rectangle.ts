/* eslint-disable @typescript-eslint/no-explicit-any */
import Node from "./node";
import { PinLayout } from "../../../node_editor";

export default class RectangleNode extends Node {
    constructor() {
        super("rectangle", 100, {
            0: { name: "draw", pinLayout: PinLayout.RIGHT_PIN, contentType: "none", data: {} },
            1: {
                name: "y",
                pinLayout: PinLayout.LEFT_PIN,
                contentType: "string",
                data: { value: "0" }
            },
            2: {
                name: "z",
                pinLayout: PinLayout.LEFT_PIN,
                contentType: "string",
                data: { value: "0" }
            },
            3: {
                name: "width",
                pinLayout: PinLayout.LEFT_PIN,
                contentType: "string",
                data: { value: "100" }
            },
            4: {
                name: "height",
                pinLayout: PinLayout.LEFT_PIN,
                contentType: "string",
                data: { value: "100" }
            }
        });
    }

    protected computeSpecific(inputs: { [id: string]: any }): { [id: string]: any } {
        const y = "1" in inputs ? inputs[1][0] : this.connectors[1].data.value;
        const x = "2" in inputs ? inputs[2][0] : this.connectors[2].data.value;
        const width = "3" in inputs ? inputs[3][0] : this.connectors[3].data.value;
        const height = "4" in inputs ? inputs[4][0] : this.connectors[4].data.value;

        const draw = (ctx: CanvasRenderingContext2D): void => {
            ctx.fillRect(x, y, width, height);
        };

        return { "0": draw };
    }
}
