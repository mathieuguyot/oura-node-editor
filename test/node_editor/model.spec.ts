import { arePositionEquals } from "../../src/node_editor/model";

test("arePositionEquals test", () => {
    expect(arePositionEquals({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true);
    expect(arePositionEquals({ x: 1, y: 2 }, { x: 0, y: 2 })).toBe(false);
    expect(arePositionEquals({ x: 1, y: 0 }, { x: 1, y: 2 })).toBe(false);
    expect(arePositionEquals({ x: 1, y: 2 }, { x: 0, y: 2 })).toBe(false);
    expect(arePositionEquals({ x: 1, y: 2 }, { x: 1, y: 0 })).toBe(false);
});
