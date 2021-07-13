import {
    makeStyles,
    CssBaseline,
    Paper,
    Card,
    CardContent,
    CardHeader,
    Avatar
} from "@material-ui/core"
import axios from "axios"

import { useEffect, useState } from "react"
import { apiRoomHistory } from "../../../urls"
import ChatHistory from "./roomChat"

import Scrollbars from 'react-custom-scrollbars'
import { Component } from "react"

// CSS for the History component
const useStyles = makeStyles((theme) => ({
    root: {
        display: "grid",
        gridTemplateColumns: "7fr 20fr 7fr",
        width: '100%',
        height: "100%",
        paddingTop: "1.8rem",
        paddingRight: "1rem",
        gap: "1rem"
    },
    paper: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    rooms: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "2rem",
        paddingLeft: "1rem",
        paddingRight: "1.5rem"
    },
    roomCard: {
        marginBottom: "1rem",
        width: "100%"
    },
    participants: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "2rem",
        paddingLeft: "1rem",
        paddingRight: "1.5rem"

    },
    participantCard: {
        marginBottom: "1rem",
        width: "100%"
    },
    avatar: {
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
    },

}))


/**
 * Room History Component that contains the participants and chat history of all created and joined rooms
 * @param {*} props 
 * @returns {Component} the Room History Component
 */
export default function History(props) {
    const classes = useStyles()

    const [allRooms, setAllRooms] = useState([])
    const [currentRoomName, setRoomName] = useState('')
    const [currentRoomCode, setRoomCode] = useState('')
    const [roomParticipants, setRoomParticipants] = useState([])

    const [roomsDone, setRoomsDone] = useState(false)   // denotes whether the rooms have been fetched successfully or not
    let roomsRes = []                                   // all the rooms which the user was ever a part of 

    useEffect(() => {
        axios.get(
            apiRoomHistory()
        ).then(response => {
            setAllRooms(response.data.rooms)
            roomsRes = response.data.rooms
        }).then(() => {
            roomsRes.reverse()
        }).then(() => {
            if (roomsRes.length > 0) {
                setRoomName(roomsRes[0].room_name)
                setRoomCode(roomsRes[0].room_code)
                setRoomParticipants(roomsRes[0].participants_history)
            }
        }).then(() => {
            setRoomsDone(true)
        }).catch(error => {
            console.log("Error came: ", error)
        })

    }, [])

    /**
     * Handles the change of room when user selects a different room than current
     * @param {string} roomName the room name
     * @param {string} roomCode the room code
     * @param {Array} roomParticipants participants that were a part of the room
     */
    const changeRoom = (roomName, roomCode, roomParticipants) => {
        setRoomName(roomName)
        setRoomCode(roomCode)
        setRoomParticipants(roomParticipants)
    }


    return (
        <div className={classes.root}>

            <CssBaseline />
            <Paper className={classes.paper} elevation={7} style={{ backgroundColor: "black" }}>
                <Scrollbars
                    style={
                        {
                            height: "100%",
                            overflow: "hidden"
                        }
                    }
                >

                    <Card
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            backgroundColor: "black",
                            color: "lightblue",
                            fontSize: "25px",
                            paddingTop: "1.5rem"
                        }}
                    >
                        Participants
                    </Card>
                    <div className={classes.participants}>
                        {
                            roomParticipants.map(participant => {
                                return (
                                    <Card
                                        className={classes.participantCard}
                                    >
                                        <CardHeader
                                            title={participant.name}
                                            avatar={
                                                <Avatar src={participant.profile_pic} className={classes.avatar}>
                                                </Avatar>
                                            }
                                        />
                                        <CardContent>
                                            Username: {participant.username}
                                        </CardContent>
                                    </Card>
                                )
                            })
                        }

                    </div>
                </Scrollbars>
            </Paper>

            <Paper className={classes.paper} elevation={7} style={{ backgroundColor: "black" }} >
                {roomsDone && <ChatHistory room_code={currentRoomCode} room_name={currentRoomName} />}
            </Paper>

            <Paper className={classes.paper} elevation={7}>
                <Scrollbars
                    style={
                        {
                            height: "100%",
                            overflow: "hidden"
                        }
                    }
                >
                    <div className={classes.rooms}>
                        {
                            allRooms.map(roomInfo => {
                                return (
                                    <Card
                                        onClick={() => changeRoom(roomInfo.room_name, roomInfo.room_code, roomInfo.participants_history)}
                                        className={classes.roomCard}
                                        style={{
                                            color: currentRoomCode == roomInfo.room_code ? "yellow" : "white",
                                            borderColor: "red",
                                            borderRadius: "3",
                                            backgroundColor: "black"
                                        }}
                                    >
                                        <CardHeader
                                            title={roomInfo.room_name}
                                        />
                                        <CardContent>
                                            Room Code: {roomInfo.room_code}
                                        </CardContent>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </Scrollbars>
            </Paper>



        </div>
    )

}