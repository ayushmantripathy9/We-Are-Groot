import {
    makeStyles,
    CssBaseline,
    Divider,
    Grid,
    Paper
} from "@material-ui/core"
import axios from "axios"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Redirect } from "react-router-dom"
import { apiRoomHistory } from "../../../urls"
import ChatHistory from "./roomChat"

const useStyles = makeStyles((theme) => ({
    root: {
        display: "grid",
        gridTemplateColumns: "8fr 15fr 10fr",
        width: '100%',
        height: "100%",
        paddingTop:"1.8rem",
        paddingRight:"1rem",
        gap: "1rem"
    },
    paper: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
}))



export default function History(props) {
    const classes = useStyles()

    const [allRooms, setAllRooms] = useState([])
    const [currentRoomName, setRoomName] = useState('')
    const [currentRoomCode, setRoomCode] = useState('')
    const [roomsDone, setRoomsDone] = useState(false)

    let roomsRes = []


    useEffect(() => {
        axios.get(
            apiRoomHistory()
        ).then(response => {
            console.log("rooms ", response.data.rooms)
            setAllRooms(response.data.rooms)
            roomsRes = response.data.rooms
        }).then(() => {
            roomsRes.reverse()
        }).then(() => {
            if (roomsRes.length > 0) {
                setRoomName(roomsRes[0].room_name)
                setRoomCode(roomsRes[0].room_code)
            }
        }).then(() => {
            setRoomsDone(true)
        }).catch(error => {
            console.log("Error came: ", error)
        })

    }, [])



    return (
        <div className={classes.root}>

            <CssBaseline />
            <Paper className={classes.paper} elevation={7}>
                Hello
            </Paper>

            <Paper className={classes.paper} elevation={7} >
                {roomsDone && <ChatHistory room_code={currentRoomCode} room_name={currentRoomName} />}
            </Paper>

            <Paper className={classes.paper} elevation={7}>
                World
            </Paper>



        </div>
    )

}