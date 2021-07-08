import { makeStyles } from "@material-ui/core"
import { useEffect, useRef } from "react"
import Scrollbars from 'react-custom-scrollbars'
import { apiWSChat } from "../../urls"
import { MESSAGE_TO_ALL } from "./messageTypes/chat"

const useStyles = makeStyles((theme)=> ({
    root: {
        
    },
    chatContainer: {

    }
}))
export default function Chat(props) {
    const chatWebSocket = useRef()
    const classes = useStyles()

    useEffect(()=>{
        chatWebSocket.current = new WebSocket(apiWSChat(props.RoomInfo.room_code))
        chatWebSocket.current.onmessage = event => {
            const message = JSON.parse(event.data)
            handleWebSocketMessage(message)
        }
    },[])

    function handleWebSocketMessage(message){
        const type = message.type
        const data = message.data
        
        switch(type){
            case MESSAGE_TO_ALL:
                break

            default:
                break
        }
    }

    function sendWebSocketMessage(message) {
        chatWebSocket.current.send(JSON.stringify(message))
    }

    return(

        <div className={classes.root}>
            <div className={classes.chatContainer}>
                <Scrollbars 
                    style={
                        {
                            height: "100%",
                            width: "100%"
                        }
                    }
                >

                </Scrollbars>
            </div>
        </div>
    )
}