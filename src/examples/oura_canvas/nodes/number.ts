/* eslint-disable @typescript-eslint/no-explicit-any */
import Node from "./node";
import { PinLayout } from "../../../node_editor";

export default class NumberNode extends Node {
    constructor() {
        super("number", 100, {
            0: {
                name: "number",
                pinLayout: PinLayout.RIGHT_PIN,
                contentType: "string",
                data: { value: "0" }
            }
        });
    }

    protected computeSpecific(): { [id: string]: any } {
        return { "0": this.connectors[0].data.value };
    }
}
