import { combineReducers } from "redux"

import userInfo from "./user"
import roomInfo from "./room"
import currentTheme from "./theme"

const reducers = combineReducers({
    userInfo,
    roomInfo,
    currentTheme
})

export default reducers
