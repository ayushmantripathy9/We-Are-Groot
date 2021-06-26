import axios from 'axios'
import { useDispatch } from 'react-redux'
import { apiRoomCreate, apiRoomJoin } from '../urls'

import { 
    INITIALIZE_ROOM, 
    UPDATE_PARTICIPANTS 
} from './types'


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
                    ...room_data
                }
            })
        }).catch(error => {
            console.log("An Error Occurred: ",error)
        })

    }    
}

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
                    ...room_data
                }
            })            
        }).catch(error => {
            console.log("An Error Occurred: ",error)
        })

    }
}

