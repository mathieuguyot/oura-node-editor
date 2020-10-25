import { arePositionEquals, getLinkId, PinType } from "../../src/node_editor/model";

test("arePositionEquals test", () => {
    expect(arePositionEquals({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true);
    expect(arePositionEquals({ x: 1, y: 2 }, { x: 0, y: 2 })).toBe(false);
    expect(arePositionEquals({ x: 1, y: 0 }, { x: 1, y: 2 })).toBe(false);
    expect(arePositionEquals({ x: 1, y: 2 }, { x: 0, y: 2 })).toBe(false);
    expect(arePositionEquals({ x: 1, y: 2 }, { x: 1, y: 0 })).toBe(false);
});

test("getLinkId test", () => {
    expect(
        getLinkId({
            inputNodeId: "node_a",
            inputPinId: "pin_b",
            outputNodeId: "node_b",
            outputPinId: "pib_a",
            linkType: "bezier",
            inputPinType: PinType.RIGHT,
            outputPinType: PinType.LEFT
        })
    ).toBe("node_a.pin_b->node_b.pib_a__bezier");
});
