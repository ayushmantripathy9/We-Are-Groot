import axios from 'axios'
import { apiRoomCreate, apiRoomJoin } from '../urls'

import { 
    INITIALIZE_ROOM, 
    INITILIAZE_PARTICIPANTS, 
    ROOM_PARTICIPANT_LEAVE, 
    UPDATE_PARTICIPANTS 
} from './types'

/**
 * Creates a room having the given name
 * @param {string} room_name name of the room
 * @returns a dispatch method to update the redux store's roomInfo
 * 
 * Makes a request to the room view in the backend and based on response creates the room
 */
export const createRoom = (room_name) => {

    return dispatch => {

        axios({
            url: apiRoomCreate(),
            method: 'post',
            data: {
                'room_name': room_name
            }
        }).then(response => {
            const room_data = response.data
            dispatch({
                type: INITIALIZE_ROOM,
                payload: {
                    loaded: true,
                    error: 0,
                    room_name: room_data.room_name,
                    room_code: room_data.room_code,
                    start_time: room_data.start_time
                }
            })
        }).catch(error => {
            console.log("An Error Occurred: ",error)
        })

    }    
}

/**
 * Makes the user join a room with given code, if it exists
 * @param {string} room_code the room code
 * @returns a dispatch method to update the redux store's roomInfo
 * 
 * Makes a request to the room join view in the backend and based on response joins the room
 */
export const joinRoom = (room_code) => {
    return dispatch => {

        axios({
            url: apiRoomJoin(),
            method: 'post',
            data : {
                'room_code': room_code
            }
        }).then(response => {
            const room_data = response.data.room_info
            dispatch({
                type: INITIALIZE_ROOM,
                payload: {
                    loaded: true,
                    error: response.data.error,
                    room_name: room_data.room_name,
                    room_code: room_data.room_code,
                    start_time: room_data.start_time
                }
            })            
        }).catch(error => {
            console.log("An Error Occurred: ",error)
        })

    }
}

/**
 * Initializes the participants of the room 
 * @param {Array} participants the participants array
 * @returns a dispatch method to initialize the participants field of the roomInfo in redux store
 */
export const initializePartipantsList = (participants) => {
    return dispatch => {
        dispatch({
            type: INITILIAZE_PARTICIPANTS,
            payload:{
                participants: participants
            }
        })
    }
}

/**
 * Adds a new participant to the room 
 * @param {Object} participant room participant
 * @returns a dispatch method to update the participants field of the roomInfo in redux store by adding the new participant 
 */
export const addNewParticipant = (participant) => {
    return dispatch => {
        dispatch({
            type: UPDATE_PARTICIPANTS,
            payload: {
                newParticipant: participant
            }
        })
    }
}

/**
 * Removes a participant from the room 
 * @param {Object} participant room participant
 * @returns a dispatch method to update the participants field of the roomInfo in redux store by removing the participant 
 */
export const participantLeave = (participant) => {
    return dispatch => {
        dispatch({
            type: ROOM_PARTICIPANT_LEAVE,
            payload: {
                participant: participant
            }
        })
    }
}