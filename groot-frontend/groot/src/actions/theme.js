import { CHANGE_THEME } from "./types"

/**
 * Changes the current theme of the app
 * @param {string} theme_state the current theme state ('dark' or 'light')
 * @returns a dispatch method to update the current theme state in the redux store
 */
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