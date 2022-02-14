import CSS from "csstype";

export type Theme = {
    node?: {
        selected?: CSS.Properties;
        unselected?: CSS.Properties;
        header?: CSS.Properties;
        body?: CSS.Properties;
        footer?: CSS.Properties;
        basePin?: CSS.Properties;
        customPins?: { [contentType: string]: CSS.Properties }
    };
    link?: {
        selected?: CSS.Properties;
        unselected?: CSS.Properties;
    };
    connectors?: { [cId: string]: unknown };
};
