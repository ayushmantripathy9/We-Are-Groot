import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { apiWSCall, routeHome } from "../../urls"

function VideoCall(props) {

    const userRef = useRef()    // user video
    const [audioState, setAudioState] = useState(false)
    const [videoState, setVideoState] = useState(false)
    const UserData = props.UserInfo.data

    const participantRef = useRef([])   // participants video
    const peerConnections = {}

    const callWebSocket = useRef()

    const iceServers = [
        {
            urls: 'stun:stun.l.google.com:19302'
        },
        {
            urls: "stun:stun.stunprotocol.org"
        },
        {
            urls: 'stun:stun3.l.google.com:19302'
        },
        {
            urls: 'stun:stun4.l.google.com:19302'
        },
    ]

    useEffect(() => {
        callWebSocket.current = new WebSocket(apiWSCall(props.RoomInfo.room_code))
        callWebSocket.current.onmessage = event => {
            const message = JSON.parse(event.data)
            handleWebSocketMessage(message)
        }
    }, [])

    useEffect(() => {
        if (videoState === true || audioState === true) {
            navigator.mediaDevices.getUserMedia({ video: videoState ? true : false, audio: audioState }).then(stream => {
                userRef.current.srcObject = stream
            })
        }
        else {
            if (userRef.current.srcObject) {
                userRef.current.srcObject.getTracks().forEach(track => {
                    track.stop()
                })
            }

            userRef.current.srcObject = null
        }
    }, [audioState, videoState])

    function handleWebSocketMessage(message){
        const data = message.data
        const type = message.type

        console.log("Type: ", type)

        switch(type){
            case "OFFER":
                console.log("Offer received from peer: ", data)
                break
                
            case "ANSWER":
                console.log("Answer received from peer: ", data)
                break

            case "ICE_CANDIDATES":
                console.log("Peer's ICE_CANDIDATES received: ", data)
                break

            default:
                break
        }
    }

    function toggleAudio() {
        setAudioState(!audioState)
    }

    function toggleVideo() {
        setVideoState(!videoState)
    }

    function leaveRoom() {
        window.location = routeHome()
    }

    return (
        <div>
            My Video
            <br />
            <button
                onClick={toggleAudio}
            >
                Toggle Audio
            </button>
            <button
                onClick={toggleVideo}
            >
                Toggle Video
            </button>
            <button
                onClick={leaveRoom}
            >
                Leave Room
            </button>
            <br />
            <video
                muted
                autoPlay
                ref={userRef}
            />
            <br />
            Participants Videos
            <br />

        </div>
    )
}

function mapStateToProps(state){
    const {roomInfo, userInfo} = state
    return {
        RoomInfo: roomInfo,
        UserInfo: userInfo
    }
}

export default connect(mapStateToProps)(VideoCall)