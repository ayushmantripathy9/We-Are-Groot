import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { BrowserRouter as Router } from "react-router-dom"

import Routing from "./Routing";
import NavBarTop from "./nav"
import { useSelector } from "react-redux";
import themes from "../themes"


function App(props) {
    const theme_name = useSelector(state => state.currentTheme.theme_name)
    const theme = createMuiTheme({
        palette: themes[theme_name]
    })

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <div 
                    style={{
                        height: "100vh"
                    }}
                >
                    <NavBarTop />
                    <Routing />
                </div>
            </ThemeProvider>
        </Router>
    )

}

export default App
