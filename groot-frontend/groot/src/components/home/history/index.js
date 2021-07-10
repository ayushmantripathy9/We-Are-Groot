import {
    makeStyles,
    CssBaseline,
} from "@material-ui/core"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Redirect } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"        
    },

}))

export default function History(props) {
    const classes = useStyles()

    const RoomInfo = useSelector(state => state.roomInfo)
    const [roomName, setRoomName] = useState('')
    const [roomCode, setRoomCode] = useState('')

    const [roomRedirect, setRoomRedirect] = useState(false)


    useEffect(() => {

        if (RoomInfo.error === 0) {
            setRoomRedirect(true)
        }
    }, [RoomInfo])




    if (roomRedirect) {
        return <Redirect to={`/room/${RoomInfo.room_code}`} />
    }

    else {
        return (
            <div className={classes.root}>
                <CssBaseline />
                    Room History
            </div>
        )
    }
}