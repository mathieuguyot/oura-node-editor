import { CustomElementsModel, SelectionItem } from "../model";

export type CustomElementProps = {
    customElementId: string;
    customElement: CustomElementsModel;
    
    onCustomElementUpdate: (customElementId: string, customElement: CustomElementsModel) => void;
    onSelectItem: (selection: SelectionItem | null, shiftKey: boolean) => void;
};
