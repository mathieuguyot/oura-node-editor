import CSS from "csstype";

export type NodeTheme = {
    selected?: CSS.Properties;
    unselected?: CSS.Properties;
    header?: CSS.Properties;
    body?: CSS.Properties;
    footer?: CSS.Properties;
}

export type LinkTheme = {
    selected?: CSS.Properties;
    unselected?: CSS.Properties;
}

export type Theme = {
    node?: NodeTheme & {
        basePin?: CSS.Properties;
        customPins?: { [contentType: string]: CSS.Properties }
    };
    link?: LinkTheme;
    connectors?: { [cId: string]: CSS.Properties };
};
