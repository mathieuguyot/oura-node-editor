/* eslint-disable @typescript-eslint/no-explicit-any */
import Node from "./node";
import { PinLayout } from "../../../node_editor";

export default class RotateNode extends Node {
    constructor() {
        super("rotate", 100, {
            0: { name: "draw", pinLayout: PinLayout.BOTH_PINS, data: {} },
            1: {
                name: "angle",
                pinLayout: PinLayout.LEFT_PIN,
                contentType: "string",
                data: { value: "0" }
            }
        });
    }

    protected computeSpecific(inputs: { [id: string]: any }): { [id: string]: any } {
        let rotation = "1" in inputs ? inputs[1][0] : this.connectors[1].data.value;
        rotation = (rotation * Math.PI) / 180;
        const drawWithRotation = (ctx: CanvasRenderingContext2D): void => {
            ctx.rotate(rotation);
            if (inputs[0]) {
                inputs[0].forEach((draw: (arg0: CanvasRenderingContext2D) => void) => {
                    draw(ctx);
                });
            }
            ctx.rotate(-rotation);
        };
        return { "0": drawWithRotation };
    }
}
