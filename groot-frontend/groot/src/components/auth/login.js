import { githubAuthRedirect, googleAuthRedirect } from "../../urls"

import cookie from 'react-cookies'
import randomstring from 'randomstring'
import { useEffect } from "react"

import Button from '@material-ui/core/Button'

const handleGithubLogin = () => {
    window.location = githubAuthRedirect(cookie.load('stateToken'))
}

const handleGoogleLogin = () => {
    window.location = googleAuthRedirect(cookie.load('stateToken'))
}

export default function Login() {
    useEffect(()=>{
        cookie.remove('stateToken')
        cookie.save('stateToken', randomstring.generate({charset: 'alphabetic'}))
    },[])

    return(
        <div>
            <Button
                variant="contained"
                size="large" color="primary"
                onClick={handleGithubLogin}
            >
                Login With GitHub
            </Button>

            <Button
                variant="contained"
                size="large" color="primary"
                onClick={handleGoogleLogin}
            >
                Login With Google
            </Button>    

        </div>
    );
}