import { CHANGE_THEME } from "./types"

export const changeTheme = (theme_state) => {
    return dispatch => {
        dispatch({
            type: CHANGE_THEME,
            payload: {
                theme_state: theme_state
            }
        })
    }
}