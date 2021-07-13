import axios from 'axios'
import { apiGihubLogin, apiGoogleLogin, apiLogout, apiVerify, routeHome } from '../urls'

import { 
    INITIALIZE_USER, 
    UNSUCCESSFUL_USER_LOGIN, 
    USER_LOGOUT
} from './types'

/**
 * Verifies whether the user is logged in or not
 * @returns a dispatch method to initialize the userInfo in the redux store
 * 
 * Makes a request to the verify api endpoint in the backend
 * Based on the response, it sets the initial state of the redux store's userInfo
 */
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

/**
 * Logs In the user into the app
 * @param {string} provider the auth provider ('github' or 'google')
 * @param {string} auth_code auth code obtained after user-confirmation in the provider-auth page
 * @returns and unsuccessful user_login response in case of failure
 * 
 * Makes request to the backend's required endpoint and logs in the user into the app
 * This is verified by the verify endpoint once the user tries to access homepage (to which it is redirected to after this process)
 */
export const userLogin = (provider, auth_code) => {
    return dispatch => {
        
        var apiLogin = (provider === 'google') ? apiGoogleLogin() : apiGihubLogin();
        
        axios({
            url: apiLogin,
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

/**
 * Logs out the user of our app
 */
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
