import React from "react";
import _ from "lodash";

import {CustomElementCollection, SelectionItem } from "./model";
import { CustomElementProps } from "./custom_elements/common";
import { createCustomElement } from "./custom_elements";

export interface CustomElementCanvasProps {
    customElements: CustomElementCollection;
    selectedItems: Array<SelectionItem>;

    onSelectItem: (selection: SelectionItem | null, shiftKey: boolean) => void;
    createCustomElement?: (props: CustomElementProps) => JSX.Element | null;
}

export default function CustomElementCanvas(props: CustomElementCanvasProps): JSX.Element {
    const { customElements, onSelectItem } = props;

    return (
        <>
            {Object.keys(customElements).map((customElementKey => {
                const ceProps: CustomElementProps = {
                    customElement: customElements[customElementKey],
                    customElementId: customElementKey,
                    onCustomElementUpdate: () => {},
                    onSelectItem: onSelectItem
                }
                let element = props.createCustomElement && props.createCustomElement(ceProps) || createCustomElement(ceProps);
                return element;
            }))}
        </>
    );
}
