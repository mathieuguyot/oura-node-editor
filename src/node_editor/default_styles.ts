import CSS from "csstype";

export const default_styles : {[nId: string] : {[nId: string] : CSS.Properties;};} = {
    dark: {
        node_selected: {
            boxShadow: "0px 0px 0px 2px white",
            borderRadius: "10px 10px 10px 10px",
        },
        node_unselected: {},
        node_header: {
            backgroundColor: "rgba(48, 141, 97, 0.75)",
            color: "white",
            borderRadius: "10px 10px 0px 0px",
            height: "20px",
            cursor: "grab",
        },
        node_background: {
            color: "white",
            backgroundColor: "rgba(63, 63, 63, 0.75)",
            cursor: "grab",
            userSelect: "none",
            MozUserSelect: "none",
        },
        node_footer: {
            borderRadius: "0px 0px 10px 10px",
            height: "10px",
            backgroundColor: "rgba(63, 63, 63, 0.75)",
            cursor: "ew-resize",
        },
        link: {
            stroke: "rgba(170, 170, 170, 0.75)",
            strokeWidth: "3px",
            fillOpacity: 0,
        },
        connector: {
            backgroundColor: "rgba(199, 199, 41, 1)",
            borderRadius: "10px 10px 10px 10px",
            cursor: "grab",
        }
    }
};
