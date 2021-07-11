import {
    Paper,
    makeStyles,
    CssBaseline,
    Button,
    Tooltip

} from '@material-ui/core'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import HistoryIcon from '@material-ui/icons/History'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import History from './history'

import { useState } from 'react'

import Joining from "./joining"
import { useDispatch } from 'react-redux'
import { userLogout } from '../../actions/user'

const useStyles = makeStyles((theme) => ({
    root: {
        height: "calc(100vh - 48px)",
        padding: "0",
        overflow: "hidden"
    },
    paper: {
        height: "100%",
        display: "grid",
        gridTemplateColumns: "3fr 25fr"

    },
    leftBar: {
        display: "grid",
        gridTemplateRows: "3fr 15fr 2fr",
        width: "66px",
        height: "calc(100vh - 48px)",
        borderRight: "1px solid black",
        paddingRight: "1rem",
        backgroundColor: "black",
        paddingLeft: "0.1rem"
    },
    navigation: {
        gridRow: "2/2",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    logout:{
        gridRow: "3/3",
        display: "flex",
        flexDirection: "column"
    },
    room: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    history: {

    }
}))

function Home(props) {

    const classes = useStyles()
    const [showHistory, setShowHistory] = useState(false)

    const dispatch = useDispatch()

    function handleHomeClick() {
        setShowHistory(false)
    }

    function handleHistoryClick() {
        setShowHistory(true)
    }

    function handleLogoutClick(){
        dispatch(userLogout())
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Paper
                className={classes.paper}
            >
                <div className={classes.leftBar}>
                    <div className={classes.navigation}>
                        <Button
                            color="default"
                            style={{
                                marginBottom: "2rem"
                            }}
                            onClick={handleHomeClick}
                            title="Rooms"
                        >
                            <AddCircleIcon
                                style={{
                                    fontSize: "28px"
                                }}
                            />
                        </Button>

                        <Button
                            color="default"
                            onClick={handleHistoryClick}
                            title="Room History"
                        >
                            <HistoryIcon
                                style={{
                                    fontSize: "28px"
                                }}
                            />
                        </Button>
                    </div>
                    <div className={classes.logout}>

                        <Button
                            color="default"
                            title="Logout"
                            onClick={handleLogoutClick}
                        >
                            <ExitToAppIcon
                                style={{
                                    fontSize: "28px"
                                }}
                            />
                        </Button>
                    </div>
                </div>
                {
                    showHistory
                        ?
                        <div className={classes.room}>
                            <History />
                        </div>
                        : <div className={classes.room}>
                            <Joining />
                        </div>
                }

            </Paper>
        </div>
    );

}

export default Home;