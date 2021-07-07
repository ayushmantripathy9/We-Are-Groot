const themes = {

    default: {
        type: "light",
        primary: { main: "#ffffff", contrastText: "#000000" },
        secondary: { main: "#356fff", contrastText: "#ffffff" },
        background: { default: "#f7f7f7", paper: "#ffffff" },
    },

    dark: {
        type: "dark",
        primary: { main: "#282828", contrastText: "#ffffff" },
        secondary: { main: "#356fff", contrastText: "#ffffff" },
        background: { default: "#18191a", paper: "#242526" },
    },

    dracula: {
        type: "dark",
        primary: { main: "#44475a", contrastText: "#bd93f9" },
        secondary: { main: "#bd93f9", contrastText: "#f8f8f2" },
        background: { default: "#20222c", paper: "#282a36" },
    },
    
};

export default themes;