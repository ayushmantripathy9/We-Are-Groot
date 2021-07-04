import {
    INITIALIZE_ROOM,
    INITILIAZE_PARTICIPANTS,
    UNSUCCESSFUL_ROOM_INITIALIZATION,
    UPDATE_PARTICIPANTS
} from "../actions/types"

let initialRoomState = {
    loaded: false,
    error: 1,
    room_name: '',
    room_code: '',
    participants: {},
    start_time: ''
}

const roomInfo = (state = initialRoomState, action) => {

    switch (action.type) {

        case INITIALIZE_ROOM:
            return action.payload

        case INITILIAZE_PARTICIPANTS:
            return {
                ...state,
                participants: action.payload.participants
            }

        case UPDATE_PARTICIPANTS:
            return {
                ...state,
                participants: {
                    ...state.participants,
                    [action.payload.newParticipant.id]: action.payload.newParticipant
                }
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