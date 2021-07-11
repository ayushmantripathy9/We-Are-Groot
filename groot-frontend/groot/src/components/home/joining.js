import {
    makeStyles,
    CssBaseline,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Card,
    CardMedia,
    CardContent
} from "@material-ui/core"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createRoom, joinRoom } from "../../actions/room"
import { Redirect } from "react-router-dom"

import groot_logo from "./../auth/media/groot_landing_logo.png"

const useStyles = makeStyles((theme) => ({
    root: {
        display: "grid",
        gridTemplateColumns: "2fr 5fr 2fr"
    },
    controls: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center"
    }
}))

export default function Joining(props) {
    const classes = useStyles()

    const RoomInfo = useSelector(state => state.roomInfo)
    const [roomName, setRoomName] = useState('')
    const [roomCode, setRoomCode] = useState('')

    const [openCreate, setOpenCreate] = useState(false)
    const [openJoin, setOpenJoin] = useState(false)

    const [roomRedirect, setRoomRedirect] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {

        if (RoomInfo.error === 0) {
            setRoomRedirect(true)
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

    if (roomRedirect) {
        return <Redirect to={`/room/${RoomInfo.room_code}`} />
    }
    else {
        return (
            <div className={classes.root}>
                <CssBaseline />
                <div className={classes.controls}>


                    <Button
                        variant="contained"
                        size="large" color="primary"
                        onClick={handleCreateDialogOpen}
                        style={{
                            marginRight: "2rem",
                            textTransform: 'none'
                        }}
                        color="secondary"
                    >
                        Create Room
                    </Button>


                    <Dialog
                        open={openCreate}
                        onClose={handleCreateDialogClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title" >
                            Create a new Room
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
                        color="secondary"
                        style={{
                            textTransform:'none'
                        }}
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
                <div className={classes.logo}>
                    <Card
                        className={classes.card}
                    >
                        <CardMedia
                            style={{ height: 200, width: 150, paddingTop: '56.25%' }}
                            image={groot_logo}
                            title="Groot"
                        />
                        <CardContent alignItems="center" >
                            <i>Let's Explore Meetings</i>
                        </CardContent>

                    </Card>
                </div>
            </div>
        )
    }
}