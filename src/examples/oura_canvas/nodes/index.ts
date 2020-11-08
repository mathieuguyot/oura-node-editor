import { NodeModel } from "../../../node_editor";

import Node from "./node";
import CanvasNode from "./canvas";
import RectangleNode from "./rectangle";
import RotateNode from "./rotate";
import NumberNode from "./number";

function createNodeSchema(
    canvasRef: React.RefObject<HTMLCanvasElement>
): { [nId: string]: NodeModel } {
    return {
        0: new CanvasNode(canvasRef),
        1: new RectangleNode(),
        2: new RotateNode(),
        3: new NumberNode()
    };
}

export { Node, CanvasNode, createNodeSchema };
