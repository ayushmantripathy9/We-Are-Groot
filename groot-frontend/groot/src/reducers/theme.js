import {
    CHANGE_THEME
} from "../actions/types"
import { createMuiTheme } from "@material-ui/core/styles";
import themes from "../themes"

let initialTheme = {
    theme_name: 'dark'
}

const currentTheme = (state = initialTheme, action) => {
    switch (action.type) {
        case CHANGE_THEME:
            return {
                theme_name: action.payload.theme_state ? 'dark' : 'dracula',
            }

        default:
            return state
    }
}

export default currentTheme