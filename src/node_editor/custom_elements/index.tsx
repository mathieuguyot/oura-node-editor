import React from "react";
import CommentCustomElement from "./comment";
import { CustomElementProps } from "./common";

export function createCustomElement(props: CustomElementProps): JSX.Element | null {
    const { customElement } = props;

    if(customElement.type === "comment") {
        return <CommentCustomElement key={props.customElementId} {...props} />;
    }

    return null;
}
