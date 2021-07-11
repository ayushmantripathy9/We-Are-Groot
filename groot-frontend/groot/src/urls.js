const isDev = true

// ...  Frontend URLs ... //

// ... URL for frontend home ... //
export const routeHome = () => {
    return isDev ? "http://localhost:50000/" : "./"
}



// ... Backend API URLs --> HTTP  ... //


// ... base URL for http api requests to the backend ... //
export const apiHome = () => {
    return "http://localhost:60000/api/"
}

// ... URL for logging in a new user via Google... //
export const apiGoogleLogin = () => {
    return `${apiHome()}auth/googleLogin/`
}

// ... URL for logging in a new user via GitHub... //
export const apiGihubLogin = () => {
    return `${apiHome()}auth/githubLogin/`
}

// ... URL for verifying user authentication ... //
export const apiVerify = () => {
    return `${apiHome()}auth/verify/`
}

// .. URL for logging out a user ... //
export const apiLogout = () => {
    return `${apiHome()}auth/logout/`
}

export const apiRoomCreate = () => {
    return `${apiHome()}room/`
}

export const apiRoomJoin = () => {
    return `${apiHome()}room/join/`
}

export const apiRoomHistory = () => {
    return `${apiHome()}room/history/`
}


// ... Backend API URLs --> WS  ... //


// ...  base URL for ws api requests to the backend ... //
export const apiWSHome = () => {
    return "ws://localhost:60000/ws/"
}

// ... URLs for user joining a room for call ... //
export const apiWSRoom = (room_code) => {
    return `${apiWSHome()}rooms/${room_code}/room/`
}

export const apiWSCall = (room_code) => {
    return `${apiWSHome()}rooms/${room_code}/room/signalling/`
}

export const apiWSChat = (room_code) => {
    return `${apiWSHome()}rooms/${room_code}/room/chat/`
}


// ... OAuth URLs ... //


// ... URL for Google OAuth where user would be redirected to ... //
export const googleAuthRedirect = (stateToken) => {
    return (
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `response_type=code&` +
        `client_id=867350364877-4jq371ln9qmjtijqfe4tu53e2vrqlcbb.apps.googleusercontent.com&` +
        `scope=openid%20profile%20email&` +
        `redirect_uri=http%3A//localhost:50000/redirect/&` +
        `state=${stateToken}0google&`+
        `provider=google`
    )
}

// ... URL for GitHub OAuth where user would be redirected to ... //
export const githubAuthRedirect = (stateToken) => {
    return (
        `https://github.com/login/oauth/authorize?` +
        `client_id=53b6230eae9169cd8193&` +
        `scope=user&` +
        `redirect_uri=http%3A//localhost:50000/redirect/&` +
        `state=${stateToken}0github&` +
        `allow_signup=true`
    )
}


// Others