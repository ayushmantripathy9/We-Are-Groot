import {
    INITIALIZE_USER
} from "../actions/types"

let initialUser = {
    loaded: false,
    login: false,
    data: {},
    error: false,
}

const userInfo = (state = initialUser, action ) => {
    switch(action.type) {
        case INITIALIZE_USER:
            return action.payload
        
        default:
            return state
    }
}

export default userInfo
