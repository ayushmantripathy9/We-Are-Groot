import { useEffect, useState } from "react";

import cookie from 'react-cookies'
import { useDispatch } from "react-redux";
import { userLogin } from "../../actions/user";


export default function VerifyLogin() {
    const [invalidToken, setInvalidToken] = useState(true)
    const [verificationStatus, setVerificationStatus] = useState(false)

    const dispatch = useDispatch()

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
        <div>
            You are being verified
        </div>
    )

}