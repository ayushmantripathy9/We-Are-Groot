import { makeStyles } from "@material-ui/core"
import { useEffect, useRef, useState } from "react"
import Scrollbars from 'react-custom-scrollbars'
import { useSelector } from "react-redux"
import { apiWSChat } from "../../urls"
import { MESSAGES_SENT_BEFORE, NEW_MESSAGE } from "./messageTypes/chat"

import {
    Paper,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Avatar
} from "@material-ui/core"
import { CssBaseline } from "@material-ui/core"

const moment = require("moment")

const useStyles = makeStyles((theme) => ({
    root: {
        height: "85.25vh",
        marginRight: '1rem',
        paddingBottom: "1rem"
    },
    chatRoot: {
        height: "100%",
        paddingBottom: "0.8rem"
    },
    chatHeader: {
        height: "5vh",
        paddingTop: "1rem",
        paddingLeft: "1rem",
        paddingBottom: "0.5rem",
        backgroundColor: "black"
    },
    paper: {
        height: "100%",
        paddingTop: "1rem",
        paddingLeft: "1.2rem",
        paddingRight: "0.4rem",
        paddingBottom: "1rem",
        overflow: "hidden",
        backgroundColor: "black"

    },
    chatContainer: {
        height: "100%",
        width: "100%",
        display: "grid",
        gridTemplateRows: "15fr 1fr",
        overflow: "hidden"

    },
    chatMessages: {
        height: "100%",
        paddingRight: "0.8rem",
        paddingTop: "1rem",
        overflow: "hidden"

    },
    chatInput: {
        height: "100%",
        width: "100%",
        paddingRight: "1rem",

    },
    chatMessageInput: {
        width: "100%",

    },
    messageCard: {
        paddingLeft: "1rem",
        paddingTop: "0.5rem",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        overflow: "hidden"
    },
    messageContent: {
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
    },
    avatar: {
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
    },
    sendMessage: {

    },
    '@global': {
        '*::-webkit-scrollbar': {
          width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.9)',
          outline: '1px solid slategrey'
        }
    }
}))
export default function Chat(props) {
    const RoomInfo = useSelector(state => state.roomInfo)
    const classes = useStyles()

    const chatWebSocket = useRef()
    const [chatMessages, setChatMessages] = useState([])
    const [inputMessage, setInputMessage] = useState('')

    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }


    useEffect(() => {
        scrollToBottom()

        chatWebSocket.current = new WebSocket(apiWSChat(RoomInfo.room_code))
        chatWebSocket.current.onmessage = event => {
            const message = JSON.parse(event.data)
            handleWebSocketMessage(message)
        }

        const input_area = document.getElementById('message-input')
        input_area.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                sendMessageToAll(input_area.value)
            }
        })

    }, [])

    useEffect(() => {
        scrollToBottom()
        console.log("Chat Messages: ", chatMessages)
    }, [chatMessages])

    function handleWebSocketMessage(message) {
        const type = message.type
        const data = message.data

        console.log("Type: ", type, " \nData: ", data)

        switch (type) {
            case MESSAGES_SENT_BEFORE:
                setChatMessages(data)
                break
            case NEW_MESSAGE:
                setChatMessages(currentState => {
                    return [
                        ...currentState,
                        data
                    ]
                })
                break
            default:
                break
        }
    }

    function sendWebSocketMessage(message) {
        chatWebSocket.current.send(JSON.stringify(message))
    }

    const handleInputMessageChange = (event) => {
        setInputMessage(event.target.value)
    }

    function sendMessageToAll(message) {
        console.log("Sending this message: ", message)
        setInputMessage('')
        sendWebSocketMessage({
            content: message
        })

    }


    return (

        <div className={classes.root}>
            <CssBaseline />
            <div className={classes.chatRoot}>
                <Paper className={classes.chatHeader}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        color: "lightblue"
                    }}
                >
                    Chat
                </Paper>
                <br />
                <Paper className={classes.paper}>

                    <div className={classes.chatContainer}>
                        <div className={classes.chatMessages}>
                            <Scrollbars
                                style={
                                    {
                                        height: "100%",
                                        overflow: "hidden"
                                    }
                                }
                            >
                                <div
                                    style={{
                                        overflow: "hidden"
                                    }}
                                >
                                    {
                                        chatMessages.map(messageInfo => {
                                            return (
                                                <Card className={classes.messageCard}>
                                                    <CardHeader
                                                        avatar={
                                                            <Avatar src={messageInfo.message.sender.profile_pic} className={classes.avatar}>
                                                            </Avatar>
                                                        }
                                                        title={messageInfo.message.sender.name}
                                                        style={{
                                                            overflow: "hidden"
                                                        }}
                                                    />


                                                    <CardContent className={classes.messageContent}>
                                                        <div
                                                            style={{
                                                                overflow: "hidden"
                                                            }}
                                                        >
                                                            {messageInfo.message.content}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: "0.75rem",
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                justifyContent: "flex-end",
                                                                alignItems: "flex-end",
                                                                overflow: "hidden"
                                                            }}
                                                        >
                                                            {moment(messageInfo.message.time_sent).format("LT")}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })
                                    }
                                </div>
                                <div style={{ float: "left", clear: "both", overflow: "hidden" }}
                                    ref={messagesEndRef}>
                                </div>
                            </Scrollbars>
                        </div>
                        <div className={classes.chatInput}>

                            <TextField
                                id="message-input"
                                className={classes.chatMessageInput}
                                variant="filled"
                                type="text"
                                label="Enter your mesage here"
                                multiline
                                value={inputMessage}
                                onChange={handleInputMessageChange}
                            />

                        </div>
                    </div>

                </Paper>
            </div>
        </div>
    )
}