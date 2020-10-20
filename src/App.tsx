import React from "react";

import NodeEditor from "./node_editor/node_editor";

const App = (): JSX.Element => (
    <div style={{ width: "100%", height: "100vh" }} className="App">
        <NodeEditor />
    </div>
);

export default App;
