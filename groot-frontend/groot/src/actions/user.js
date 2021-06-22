import axios from 'axios'
import { apiGihubLogin, apiGoogleLogin, apiLogout, apiVerify, routeHome } from '../urls'

import { 
    INITIALIZE_USER, 
    UNSUCCESSFUL_USER_LOGIN, 
    USER_LOGOUT
} from './types'


export const verifyLoggedIn = () => {
    return dispatch => {
        axios.get(
            apiVerify()
        ).then(response => {

            const isLoggedIn = response.data['isLoggedIn']

            if (isLoggedIn) {
                dispatch({
                    type: INITIALIZE_USER,
                    payload: {
                        login: true,
                        hasLoaded: true,
                        data: response.data['user_details'],
                        error: false
                    }
                })
            }
            else {
                dispatch({
                    type: INITIALIZE_USER,
                    payload: {
                        login: false,
                        hasLoaded: true,
                        data: {},
                        error: false
                    }
                })

                /*
                    Here the request was made to the backend but the verification of user-login was unsuccessful
                    Thus, the login state remains false, but hasLoaded becomes true as request was made already
                */
            }

        }).catch(error => {
            dispatch({
                type: UNSUCCESSFUL_USER_LOGIN,
                payload: {
                    login: false,
                    hasLoaded: false,
                    error: true,
                }

                /*
                    Here, the request itself wasn't configured properly,
                    Thus, both login and hasLoaded states remained false
                    Reqeust would be made to backend again for verifying user-login
                */
            })
        })
    }
}

export const userLogin = (provider, auth_code) => {
    return dispatch => {
        
        var loginRedirect = (provider === 'google') ? apiGoogleLogin() : apiGihubLogin();
        
        axios({
            url: loginRedirect,
            method: 'post',
            data: {
                'auth_code': auth_code
            }
        }).then(response => {
            window.location = routeHome()
        }).catch(error => {
            dispatch({
                type: UNSUCCESSFUL_USER_LOGIN,
                payload: {
                    login: false,
                    hasLoaded: true,
                    error: true
                }
            })
            
            window.location = routeHome()

            /*
                Here the request was made to the backend but the login was unsuccessful
                Thus, the login state remains false, but hasLoaded becomes true as request was made already
            */
        })
    }
}

export const userLogout = () => {
    return dispatch => {
        axios({
            url: apiLogout(),
            method: 'post'
        }).then(response => {
            window.location = routeHome()
            dispatch({
                type: USER_LOGOUT,
                payload: {
                    login:false,
                }
            })
        }).catch(error => {
            window.location = routeHome()
        })

    }
}
