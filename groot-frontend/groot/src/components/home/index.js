import {
    makeStyles,
    CssBaseline,
    Button,

} from '@material-ui/core'

// imports for the icons used
import AddCircleIcon from '@material-ui/icons/AddCircle'
import HistoryIcon from '@material-ui/icons/History'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import History from './history'

import { useState } from 'react'

import Joining from "./joining"
import { useDispatch } from 'react-redux'
import { userLogout } from '../../actions/user'

// CSS for the Home Component
const useStyles = makeStyles((theme) => ({
    root: {
        height: "calc(100vh - 48px)",
        padding: "0",
    },
    container: {
        height: "100%",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "2fr 39fr"

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
    logout: {
        gridRow: "3/3",
        display: "flex",
        flexDirection: "column"
    },
    room: {
        gridColumn: "2/2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 48px)",
    },
    history: {

    }
}))

/**
 * The Home Component
 * @returns {Component}  Home component
 * 
 * The home component has:
 *  - The left-nav bar
 *  - Joining Component or the RoomHistory Component (depending on the selected state)
 */
function Home() {

    const classes = useStyles()
    const [showHistory, setShowHistory] = useState(false)   // determines whether to show the Joining Component or the History Component

    const dispatch = useDispatch()

    /**
     * - Sets showHistory to false
     * - Shows the Joining Component
     */
    function handleHomeClick() {
        setShowHistory(false)
    }

    /**
     * - Sets showHistory to true
     * - Shows the History Component
     */
    function handleHistoryClick() {
        setShowHistory(true)
    }

    function handleLogoutClick() {
        dispatch(userLogout())
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <div
                className={classes.container}
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
                                    fontSize: "28px",
                                    color: !showHistory ? "yellow" : "white"
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
                                    fontSize: "28px",
                                    color: showHistory ? "yellow" : "white"
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
                                    fontSize: "28px",
                                    color: "red"
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

            </div>
        </div>
    );

}

export default Home;