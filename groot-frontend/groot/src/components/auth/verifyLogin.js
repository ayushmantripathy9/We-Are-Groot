import { makeStyles } from "@material-ui/core"
import { useEffect, useState } from "react"

import cookie from 'react-cookies'
import { useDispatch } from "react-redux"
import { userLogin } from "../../actions/user"

import CircularProgress from '@material-ui/core/CircularProgress'
import { Paper } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100.0vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    paper: {
        height:"100%",
        width:"100%",
        display:"flex",
        justifyContent: "center",
        alignItems: "center"
    }

}))

/**
 * An Intermediate Component which is rendered when the user waits for Login
 * @returns {Component} Circular Progress to show login being verified
 */
export default function VerifyLogin() {
    const [invalidToken, setInvalidToken] = useState(true)
    const [verificationStatus, setVerificationStatus] = useState(false)

    const dispatch = useDispatch()

    const classes = useStyles()

    /*
        The state token and the auth code are retrieved from the URL
        Then login request is made to the backend
    */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)

        const authCode = params.get('code')

        const stateReturned = params.get('state')
        const stateData = stateReturned.split('0')
        const stateToken = stateData[0]
        const provider = stateData[1]

        if ((stateToken !== cookie.load('stateToken')) || (authCode === '') || (authCode === null)) {
            console.log("stateToken didn't match")
        }
        else {
            setVerificationStatus(true)
            setInvalidToken(false)
        }

        dispatch(userLogin(provider, authCode))

    }, [])

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <CircularProgress color="secondary" />
            </Paper>
        </div>
    )

}