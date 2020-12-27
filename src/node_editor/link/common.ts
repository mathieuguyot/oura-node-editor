import { LinkPositionModel } from "../model";

export type LinkProps = {
    linkId?: string;
    linkPosition: LinkPositionModel;
    linkType?: string;

    isLinkSelected: boolean;
    onSelectLink?: (linkId: string, shiftKey: boolean) => void;

    key?: string;
};
