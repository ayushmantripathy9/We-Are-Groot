import {
    Paper,
    makeStyles,
    CssBaseline,
    Button,
    Divider

} from '@material-ui/core'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import HistoryIcon from '@material-ui/icons/History'
import { useState } from 'react'
import History from './history'

import Joining from "./joining"

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

    function handleHomeClick() {
        setShowHistory(false)
    }

    function handleHistoryClick() {
        setShowHistory(true)
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
                            startIcon={
                                <AddCircleIcon
                                    style={{
                                        fontSize: "30px"
                                    }}
                                />
                            }
                            color="default"
                            style={{
                                marginBottom: "2rem"
                            }}
                            onClick={handleHomeClick}
                        />

                        <Button
                            startIcon={
                                <HistoryIcon
                                    style={{
                                        fontSize: "30px"
                                    }}
                                />
                            }
                            color="default"
                            onClick={handleHistoryClick}
                        />
                    </div>
                </div>
                {
                    showHistory
                        ?
                            <div className={classes.room}>          
                                <History />
                            </div>
                        :   <div className={classes.room}>
                                <Joining />
                            </div>
                }

            </Paper>
        </div>
    );

}

export default Home;