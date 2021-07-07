import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { BrowserRouter as Router } from "react-router-dom"

import Routing from "./Routing";
import NavBarTop from "./nav"
import { useSelector } from "react-redux";



function App(props) {
    const theme =
        createMuiTheme({
            palette: {
                type: 'dark'
            }
        })

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <NavBarTop />
                <Routing />
            </ThemeProvider>
        </Router>
    )

}

export default App
