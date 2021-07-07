import {
    CHANGE_THEME
} from "../actions/types"
import { createMuiTheme } from "@material-ui/core/styles";
import themes from "../themes"

let dark_mui_theme = createMuiTheme({
    palette: themes['dark']
})

let dracula_mui_theme = createMuiTheme({
    palette: themes['dracula']
})

let initialTheme = {
    theme: dark_mui_theme,
}

const currentTheme = (state = initialTheme, action) => {
    switch (action.type) {
        case CHANGE_THEME:
            return {
                theme: action.payload.theme_state ? dracula_mui_theme : dark_mui_theme,
            }
        
        default:
            return state
    }
}

export default currentTheme