import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { apiWSCall, routeHome } from "../../urls"

import { 
    ANSWER, 
    CALL_CONNECTED, 
    ICE_CANDIDATE, 
    OFFER 
} from "./messageTypes/signalling"

function VideoCall(props) {

    const UserData = props.UserInfo.data
    const userRef = useRef()    // user video
    const [audioState, setAudioState] = useState(false)
    const [videoState, setVideoState] = useState(false)

    const peerConnections = {}
    const [videoStreams, setVideoStreams] = useState({})    // would contain all the video streams of all users 

    const callWebSocket = useRef()

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

    function handleWebSocketMessage(message) {
        const type = message.type
        const data = message.data

        switch (type) {
            case CALL_CONNECTED:
                console.log("Call connected to the room : ", data)
                callPeers(data)
                break

            case OFFER:
                console.log("Offer received from peer: ", data)
                handleOfferMessage(data)
                break

            case ANSWER:
                console.log("Answer received from peer: ", data)
                handleAnswerMessage(data)
                break

            case ICE_CANDIDATE:
                handleIceCandidiateMessage(data)
                break

            default:
                break
        }
    }

    function sendWebSocketMessage(message) {
        callWebSocket.current.send(JSON.stringify(message))
    }

    //  WebRTC RELATED CONSTANTS AND FUNCTIONS  //
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

    function callPeers(peers) {
        const offerRequests = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1,
        }

        peers.forEach(peer => {
            if (peer.id === UserData.id)
                return

            peerConnections[peer.id] = createPeer(peer.id)

            peerConnections[peer.id]
                .createOffer(offerRequests)
                .then(offer => {
                    return peerConnections[peer.id].setLocalDescription(offer)
                })
                .then(() => {
                    sendWebSocketMessage({
                        type: "OFFER",
                        message: {
                            targetID: peer.id,
                            senderID: UserData.id,
                            sdp: peerConnections[peer.id].localDescription
                        }
                    })
                })
                .catch(error => {
                    console.log("Error occurred while calling peer :", peer.id, "\n Error : ", error)
                })
        })
    }

    function createPeer(targetID) {

        let peer_connection = new RTCPeerConnection({ iceServers })

        peer_connection.onnegotiationneeded = handleNegotiationNeededEvent(peer_connection, targetID)
        peer_connection.ontrack = handleTrackEvent(targetID)
        peer_connection.onremovestream = handleRemoveStreamEvent(targetID)
        peer_connection.onicecandidate = handleIceCandidateEvent(targetID)

        return peer_connection
    }

    //      FUNCTIONS FOR CREATING THE PEER CONNECTIONS     //

    function handleNegotiationNeededEvent(peer_connection, targetID) {
        const offerRequests = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1,
        }

        return event => {
            peer_connection.createOffer(offerRequests).then(offer => {
                return peer_connection.setLocalDescription(offer)
            }).then(() => {
                sendWebSocketMessage({
                    type: "OFFER",
                    message: {
                        targetID: targetID,
                        senderID: UserData.id,
                        sdp: peer_connection.localDescription
                    }
                })
            }).catch(error => {
                console.log("An Error Occured in offer: ", error)
            })
        }
    }

    function handleTrackEvent(targetID) {
        return event => {
            let participantStream = videoStreams[targetID]

            if (!participantStream)
                participantStream = new MediaStream()

            participantStream.addTrack(event.track)

            setVideoStreams({
                ...videoStreams,
                [targetID]: participantStream
            })
        }
    }

    function handleRemoveStreamEvent(targetID) {
        return event => {
            setVideoStreams({
                ...videoStreams,
                [targetID]: event.stream
            })
        }
    }

    function handleIceCandidateEvent(targetID) {
        return event => {
            if (event.candidate) {
                sendWebSocketMessage({
                    type: "ICE_CANDIDATE",
                    message: {
                        targetID: targetID,
                        senderID: UserData.id,
                        candidate: event.candidate
                    }
                })
            }
        }
    }

    //      END OF FUNCTIONS FOR CREATING PEER CONNECTIONS      //

    
    //      FUNCTIONS FOR HANDLING RTC SIGNALLING EVENTS        //

    function handleOfferMessage(message) {
        const { targetID, senderID, sdp } = message

        if (targetID !== UserData.id)
            return

        const description = new RTCSessionDescription(sdp)
        
        if (!peerConnections[senderID])
            peerConnections[senderID] = createPeer(senderID)

        peerConnections[senderID]
            .setRemoteDescription(description)
            .then(() => {
                return peerConnections[senderID].createAnswer()
            })
            .then(answer => {
                return peerConnections[senderID].setLocalDescription(answer)
            })
            .then(() => {
                sendWebSocketMessage({
                    type: "ANSWER",
                    message: {
                        targetID: senderID,
                        senderID: UserData.id,
                        sdp: peerConnections[senderID].localDescription
                    }
                })
            })
    }

    function handleAnswerMessage(message) {
        const { targetID, senderID, sdp } = message

        if (targetID !== UserData.id)
            return

        const description = new RTCSessionDescription(sdp)

        peerConnections[senderID]
            .setRemoteDescription(description)
            .then(() => { })
            .catch(() => { })
    }

    function handleIceCandidiateMessage(message) {
        if (message.targetID !== UserData.id)
            return

        const ice_candidiate = new RTCIceCandidate(message.candidate)

        peerConnections[message.senderID]
            .addIceCandidate(ice_candidiate)
            .then(() => { })
    }

    //      END OF FUNCTIONS FOR HANDLING RTC SIGNALLING EVENTS     //

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

function mapStateToProps(state) {
    const { roomInfo, userInfo } = state
    return {
        RoomInfo: roomInfo,
        UserInfo: userInfo
    }
}

export default connect(mapStateToProps)(VideoCall)