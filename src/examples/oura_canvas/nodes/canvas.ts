/* eslint-disable @typescript-eslint/no-explicit-any */
import Node from "./node";
import { PinLayout } from "../../../node_editor";

export default class CanvasNode extends Node {
    canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
        super("canvas", 100, {
            0: { name: "draw", pinLayout: PinLayout.LEFT_PIN, data: {} }
        });
        this.canvasRef = canvasRef;
    }

    protected computeSpecific(inputs: { [id: string]: any }): { [id: string]: any } {
        if (this.canvasRef.current) {
            const ctx = this.canvasRef.current.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
                if (inputs[0]) {
                    inputs[0].forEach((draw: (arg0: CanvasRenderingContext2D) => void) => {
                        draw(ctx);
                    });
                }
            }
        }
        return {};
    }
}
