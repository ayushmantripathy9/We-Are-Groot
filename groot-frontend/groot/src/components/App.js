import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Home from "./home";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { verifyLoggedIn } from '../actions/user';
import VerifyLogin from './auth/verifyLogin';
import Login from './auth/login';
import Room from './room';




function App(props) {
    const UserInfo = useSelector(state => state.userInfo)
    const dispatch = useDispatch()

    useEffect(() => {
        if (UserInfo.hasLoaded === false) {
            const loc = window.location.pathname.split('/')
            if (loc[0] !== 'redirect') {
                dispatch(verifyLoggedIn())
            }
        }
    },[])

    if (UserInfo.hasLoaded === false) {
        return (
            <Router>
                <Switch>

                    <Route
                        exact
                        path='/redirect'
                        component={VerifyLogin}
                    />

                    <Redirect to='' />

                </Switch>
            </Router>
        )
    }
    else if (UserInfo.login === true) {
        return (
            <Router>
                <Switch>

                    <Route
                        exact
                        path={`${props.match.path}`}
                        component={Home}
                    />

                    <Route
                        exact
                        path={`${props.match.path}room/:room_code/`}
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

export default App;
