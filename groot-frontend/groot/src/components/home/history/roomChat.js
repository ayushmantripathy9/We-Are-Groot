import { makeStyles } from "@material-ui/core"
import { useEffect, useRef, useState } from "react"
import Scrollbars from 'react-custom-scrollbars'
import { useSelector } from "react-redux"
import { MESSAGES_SENT_BEFORE, NEW_MESSAGE } from "../../room/messageTypes/chat"

import {
    Paper,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Avatar
} from "@material-ui/core"
import { CssBaseline } from "@material-ui/core"
import { apiWSChat } from "../../../urls"

const moment = require("moment")

const useStyles = makeStyles((theme) => ({
    root: {
        height: "calc(100vh - 80px)",
        width: "100%",
    },
    chatRoot: {
        height: "100%",
        display:"grid",
        gridTemplateRows: "1fr 20fr"
    },
    chatHeader: {
        height: "100%",
        paddingTop: "1rem",
        paddingLeft: "1rem",
        paddingBottom: "0.5rem",
    },
    paper: {
        height: "100%",
        paddingTop: "1rem",
        paddingLeft: "1rem",
        paddingBottom: "1rem",

    },
    chatContainer: {
        height: "100%",
        width: "100%",
        display: "grid",
        gridTemplateRows: "15fr 1fr",
    },
    chatMessages: {
        height: "100%",
        paddingRight: "0.8rem",
        paddingTop: "1rem",
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

    },
    messageContent: {
        display: "flex",
        flexDirection: "column",

    },
    avatar: {
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
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
export default function ChatHistory(props) {
    const classes = useStyles()

    const chatWebSocket = useRef()
    const [chatMessages, setChatMessages] = useState([])

    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }


    useEffect(() => {
        scrollToBottom()
        if(props.room_code !== ''){

            chatWebSocket.current = new WebSocket(apiWSChat(props.room_code))
            chatWebSocket.current.onmessage = event => {
                const message = JSON.parse(event.data)
                handleWebSocketMessage(message)
            }
        }

    }, [props.room_code])

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
            default:
                break
        }
    }




    return (

        <div className={classes.root}>
            <CssBaseline />
            <div className={classes.chatRoot}>
                <div className={classes.chatHeader}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px"
                    }}
                >
                    <i>{ ` ${props.room_name}`}</i> 
                    <br/>
                </div>
                <div className={classes.paper}>

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
                    </div>

                </div>
            </div>
        </div>
    )
}