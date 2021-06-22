import {
    INITIALIZE_USER, 
    UNSUCCESSFUL_USER_LOGIN,
    USER_LOGOUT
} from "../actions/types"

let initialUser = {
    login: false,
    hasLoaded: false,
    data: {},
    error: false,
}

const userInfo = (state = initialUser, action) => {

    switch (action.type) {

        case INITIALIZE_USER:
            return action.payload

        case UNSUCCESSFUL_USER_LOGIN:
            return {
                ...state,
                login: action.payload.login,
                hasLoaded: action.payload.hasLoaded,
                error: action.payload.error
            }
        
        case USER_LOGOUT:
            return {
                ...state,
                login: action.payload.login
            }

        default:
            return state
    }

}

export default userInfo
