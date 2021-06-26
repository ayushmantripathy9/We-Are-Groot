import {
    INITIALIZE_ROOM, 
    UNSUCCESSFUL_ROOM_INITIALIZATION, 
    UPDATE_PARTICIPANTS
} from "../actions/types"

let initialRoomState = {
    loaded: false,
    error: 1,
    room_name:'',
    room_code:'',
    participants: [],
    start_time:''
}

const roomInfo = (state = initialRoomState, action) => {
    
    switch(action.type) {

        case INITIALIZE_ROOM:
            return action.payload
        
        case UPDATE_PARTICIPANTS:
            return {
                ...state,
                participants: action.payload.participants
            }
        
        case UNSUCCESSFUL_ROOM_INITIALIZATION:
            return {
                ...state,
                loaded: action.payload.loaded,
                error: action.payload.error
            }
        
        default:
            return state
    }
}

export default roomInfo