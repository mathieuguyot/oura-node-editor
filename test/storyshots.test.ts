import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from "@storybook/addon-storyshots";
 
initStoryshots({
    integrityOptions: { cwd: path.resolve(__dirname, '../src/stories') },
    configPath: path.resolve(__dirname, '../.storybook'),
    test: multiSnapshotWithOptions()
});
