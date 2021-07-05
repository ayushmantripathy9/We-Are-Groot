import { useEffect, useRef, useState } from "react"

import { connect, useDispatch } from "react-redux"
import { addNewParticipant, initializePartipantsList } from "../../actions/room"

import { apiWSRoom } from "../../urls"

import { 
    ROOM_PARTICIPANTS, 
    USER_JOINED, 
    USER_LEFT 
} from "./messageTypes/room"

import VideoCall from "./videoCall"


function Room(props) {
    const roomWebSocket = useRef(null)

    const [participantsReceived, setParticipantsRecieved] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        roomWebSocket.current = new WebSocket(apiWSRoom(props.RoomInfo.room_code))
        roomWebSocket.current.onmessage = event => {
            const message = JSON.parse(event.data)
            handleWebSocketMessage(message)
        }
    }, [])


    useEffect(()=>{
        console.log("New Room Info: ",props.RoomInfo)
    },[props])

    function handleWebSocketMessage(message) {
        const data = message.data
        const type = message.type

        // make these as variables
        switch (type) {
            case USER_JOINED:
                if(data.id !== props.UserInfo.data.id){
                    dispatch(addNewParticipant(data))
                }
                
                break

            case ROOM_PARTICIPANTS:
                let participants = handleParticipantsList(data)
                
                dispatch(initializePartipantsList(participants))
                setParticipantsRecieved(true)
                
                break
                
            // update this case for user leaving a meeting
            // write a dispatch method to remove user from RoomInfo
            case USER_LEFT:
                console.log("User Left: ",data)
                break

            default:
                break
        }
    }

    /**
     * Function to convert the incoming participant list into a dictionary
     * This would be required to store them as a dictionary in the redux-store
     * @param {*} participantsList 
     * @returns {room_participants_dict} 
     */
    function handleParticipantsList(participantsList) {
        let room_participants = {}
        participantsList.forEach(participant => {
            room_participants[participant.id] = participant
        })

        return room_participants
    }


    return (
        <div>
            <h2>Room component</h2>
            <h3>
                Room Code : {props.RoomInfo.room_code}
            </h3>

            {participantsReceived && <VideoCall />}

        </div>
    )
}

function mapStateToProps(state){
    const {roomInfo, userInfo} = state
    return {
        RoomInfo: roomInfo,
        UserInfo: userInfo
    }
}

export default connect(mapStateToProps)(Room)