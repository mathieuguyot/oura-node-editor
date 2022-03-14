import { LinkModel, LinkPositionModel } from "../model";

export type LinkProps = {
    linkId?: string;
    linkPosition: LinkPositionModel;
    link?: LinkModel;

    isLinkSelected: boolean;
    onSelectLink?: (linkId: string, shiftKey: boolean) => void;

    key?: string;
};
