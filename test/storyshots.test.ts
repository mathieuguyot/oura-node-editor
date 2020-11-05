// import initStoryshot from "@storybook/addon-storyshots";
import { arePositionEquals } from "../src/node_editor/model";

// initStoryshot();
test("dumb_test", () => {
    expect(arePositionEquals({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true);
});
