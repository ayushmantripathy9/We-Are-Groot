import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Redirect } from 'react-router-dom'

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@material-ui/core'
import { createRoom, joinRoom } from "../../actions/room";
import Room from "../room";
import { routeHome } from "../../urls";


function Home(props) {
    const UserInfo = useSelector(state => state.userInfo)
    const RoomInfo = useSelector(state => state.roomInfo)

    const [roomName, setRoomName] = useState('')
    const [roomCode, setRoomCode] = useState('')
    const [openCreate, setOpenCreate] = useState(false)
    const [openJoin, setOpenJoin] = useState(false)

    useEffect(() => {

        if (RoomInfo.error === 0) {
            props.history.push(`/room/${RoomInfo.room_code}`)
            // alert(`/room/${RoomInfo.room_code}/`)
            // return(
            //     <Redirect to={`/room/${RoomInfo.room_code}/`} />
            // )   
        }
    }, [RoomInfo])

    const dispatch = useDispatch()

    const handleCreateDialogOpen = () => {
        setOpenCreate(true)
    }

    const handleRoomNameChange = (e) => {
        setRoomName(e.target.value)
    }

    const handleCreateDialogClose = (box) => {
        setOpenCreate(false)
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
    }

    const handleRoomJoin = () => {
        dispatch(joinRoom(roomCode))
        handleJoinDialogClose()
    }

    // if (RoomInfo.loaded) {
    //     return (
    //         <Room />
    //     )
    // }
    // else {
    return (
        <div>
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
                <img src={UserInfo.data.profile_pic} />
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
                            auroFocus
                            margin="dense"
                            id="dialog-text"
                            type="text"
                            fullWidth
                            value={roomName}
                            onChange={handleRoomNameChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCreateDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleRoomCreate} color="primary">
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
                            auroFocus
                            margin="dense"
                            id="dialog-text"
                            type="text"
                            fullWidth
                            value={roomCode}
                            onChange={handleRoomCodeChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleJoinDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleRoomJoin} color="primary">
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        </div>
    );
    // }

}

export default Home;