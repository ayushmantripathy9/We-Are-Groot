import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Home from "./home"

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { userLogin, verifyLoggedIn } from '../actions/user'
import VerifyLogin from './auth/verifyLogin'
import Login from './auth/login';
import Room from './room';

import {
    makeStyles,
    Paper

} from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

import cookie from 'react-cookies'

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100.0vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    paper: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

}))


function Routing(props) {
    const UserInfo = useSelector(state => state.userInfo)
    const dispatch = useDispatch()

    useEffect(() => {
        if (UserInfo.hasLoaded === false) {
            const loc = window.location.pathname.split('/')
            if (loc[0] !== 'redirect') {
                dispatch(verifyLoggedIn())
            }
            else {
                const params = new URLSearchParams(window.location.search)

                const authCode = params.get('code')

                const stateReturned = params.get('state')
                const stateData = stateReturned.split('0')
                const stateToken = stateData[0]
                const provider = stateData[1]

                if ((stateToken !== cookie.load('stateToken')) || (authCode === '') || (authCode === null)) {
                    console.log("stateToken didn't match")
                }

                dispatch(userLogin(provider, authCode))
            }
        }
    }, [])

    const { match } = props
    const classes = useStyles()

    if (UserInfo.hasLoaded === false) {
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <CircularProgress color="secondary" />
                </Paper>
            </div>
        )
    }
    else if (UserInfo.login === true) {
        return (
            <Router>
                <Switch>

                    <Route
                        exact
                        path='/'
                        component={Home}
                    />

                    <Route
                        exact
                        path={`${match.path}room/:room_code/`}
                        component={Room}
                    />

                    <Route
                        exact
                        path='/room/:room_code/'
                        component={Room}
                    />

                    <Redirect to='' />

                </Switch>
            </Router>
        )
    }
    else if (UserInfo.login === false) {
        return (
            <Router>
                <Switch>

                    <Route
                        exact
                        path='/redirect'
                        component={VerifyLogin}
                    />

                    <Route
                        exact
                        path=''
                        component={Login}
                    />

                    <Redirect to='' />

                </Switch>
            </Router>
        )
    }

}

export default Routing;
