import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from 'react-router-dom'

import {
    Paper,
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    makeStyles,
    CssBaseline
} from '@material-ui/core'

import { createRoom, joinRoom } from "../../actions/room";
import Room from "../room";
import { routeHome } from "../../urls";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "calc(100vh - 48px)",
        padding: "0",
        overflow: "hidden"
    },
    paper: {
        height: "100%",
    }
}))
function Home(props) {
    const UserInfo = useSelector(state => state.userInfo)
    const RoomInfo = useSelector(state => state.roomInfo)

    const classes = useStyles()

    const [roomName, setRoomName] = useState('')
    const [roomCode, setRoomCode] = useState('')
    const [openCreate, setOpenCreate] = useState(false)
    const [openJoin, setOpenJoin] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {

        if (RoomInfo.error === 0) {
            props.history.push(`/room/${RoomInfo.room_code}`)
        }
    }, [RoomInfo])


    const handleCreateDialogOpen = () => {
        setOpenCreate(true)
    }

    const handleRoomNameChange = (e) => {
        setRoomName(e.target.value)
    }

    const handleCreateDialogClose = (box) => {
        setOpenCreate(false)
        setRoomName('')
    }

    const handleRoomCreate = () => {
        dispatch(createRoom(roomName))
        handleCreateDialogClose()
    }

    const handleJoinDialogOpen = () => {
        setOpenJoin(true)
    }

    const handleRoomCodeChange = (e) => {
        setRoomCode(e.target.value)
    }

    const handleJoinDialogClose = (box) => {
        setOpenJoin(false)
        setRoomCode('')
    }

    const handleRoomJoin = () => {
        dispatch(joinRoom(roomCode))
        handleJoinDialogClose()
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Paper
                className={classes.paper}
            >
                <h2>
                    <i>Groot's Home</i><br />
                </h2>
                You are welcome as of now, {UserInfo.data.name}

                <div>
                    <h3>
                        What Groot <i>knows</i> ;)
                    </h3>
                    <ul>
                        <li>Username: {UserInfo.data.username} </li>
                        <li>Name: {UserInfo.data.name}</li>
                    </ul>
                    <br />
                    <Button
                        variant="contained"
                        size="large" color="primary"
                        onClick={handleCreateDialogOpen}
                    >
                        Create Room
                    </Button>

                    <Dialog
                        open={openCreate}
                        onClose={handleCreateDialogClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title" >
                            Create New Room
                        </DialogTitle>
                        <DialogContent>

                            <DialogContentText>
                                Enter a name for your room:
                            </DialogContentText>

                            <TextField
                                autoFocus
                                margin="dense"
                                id="dialog-text"
                                type="text"
                                fullWidth
                                value={roomName}
                                onChange={handleRoomNameChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCreateDialogClose} color="default">
                                Cancel
                            </Button>
                            <Button onClick={handleRoomCreate} color="secondary">
                                Continue
                            </Button>
                        </DialogActions>
                    </Dialog>


                    <Button
                        variant="contained"
                        size="large" color="primary"
                        onClick={handleJoinDialogOpen}
                    >
                        Join Room
                    </Button>

                    <Dialog
                        open={openJoin}
                        onClose={handleJoinDialogClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">
                            Join a Room
                        </DialogTitle>
                        <DialogContent>

                            <DialogContentText>
                                Enter the room code:
                            </DialogContentText>

                            <TextField
                                autoFocus
                                margin="dense"
                                id="dialog-text"
                                type="text"
                                fullWidth
                                value={roomCode}
                                onChange={handleRoomCodeChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleJoinDialogClose} color="default">
                                Cancel
                            </Button>
                            <Button onClick={handleRoomJoin} color="secondary">
                                Continue
                            </Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </Paper>
        </div>
    );

}

export default Home;