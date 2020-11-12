import CSS from "csstype";

const defaultStyles: {
    [nId: string]: { [nId: string]: CSS.Properties };
} = {
    dark: {
        nodeSelected: {
            boxShadow: "0px 0px 0px 2px white",
            borderRadius: "10px 10px 10px 10px"
        },
        nodeUnselected: {},
        nodeHeader: {
            backgroundColor: "rgba(48, 141, 97, 0.75)",
            color: "white",
            borderRadius: "10px 10px 0px 0px",
            height: "20px",
            cursor: "grab"
        },
        nodeBackground: {
            color: "white",
            backgroundColor: "rgba(63, 63, 63, 0.75)",
            cursor: "grab",
            userSelect: "none",
            MozUserSelect: "none"
        },
        nodeFooter: {
            borderRadius: "0px 0px 10px 10px",
            height: "10px",
            backgroundColor: "rgba(63, 63, 63, 0.75)",
            cursor: "ew-resize"
        },
        link: {
            stroke: "rgba(170, 170, 170, 0.75)",
            strokeWidth: "3px",
            fillOpacity: 0
        },
        linkSelected: {
            stroke: "white"
        },
        pin: {
            backgroundColor: "rgba(199, 199, 41, 1)",
            borderRadius: "10px 10px 10px 10px",
            cursor: "grab"
        }
    }
};

export default defaultStyles;
