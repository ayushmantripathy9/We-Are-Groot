import { combineReducers } from "redux"

import userInfo from "./user"
import roomInfo from "./room"

const reducers = combineReducers({
    userInfo,
    roomInfo
})

export default reducers
