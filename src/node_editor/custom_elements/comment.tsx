import React, { Component } from "react";
import CSS from "csstype";

import { CustomElementProps } from "./common";

class CommentCustomElement extends Component<CustomElementProps> {

    render(): JSX.Element {

        const style: CSS.Properties = {
            position: "absolute",
            width: `100px`,
            height: "100px",
            top: `${this.props.customElement.position.x}px`,
            left: `${this.props.customElement.position.y}px`,
            backgroundColor: "orange"
        };

        return (
            <div style={style}>
                aaaaaa
            </div>
        );
    }
}

export default CommentCustomElement;
