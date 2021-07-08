import { makeStyles } from "@material-ui/core"
import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { apiWSCall, routeHome } from "../../urls"
import Chat from "./chat"

import {
    ANSWER,
    CALL_CONNECTED,
    ICE_CANDIDATE,
    OFFER
} from "./messageTypes/signalling"

import Videos from "./videos"

const useStyles = makeStyles((theme) => ({
    root: {
        display: "grid",
        gridTemplateColumns: "4fr 1fr"
    },
    videoChat: {

    },
    chat: {

    }
}))

function VideoCall(props) {

    const UserData = props.UserInfo.data
    const [audioState, setAudioState] = useState(false)
    const [videoState, setVideoState] = useState(false)

    const peerConnections = useRef({})  // all the peer-connections for sharing video and audio to all users
    const videoStreamSent = useRef({})
    const audioStreamSent = useRef({})

    const [userStreams, setUserStreams] = useState({})    // would contain all the video streams of all users 

    const callWebSocket = useRef()

    const classes = useStyles()

    useEffect(() => {
        callWebSocket.current = new WebSocket(apiWSCall(props.RoomInfo.room_code))
        callWebSocket.current.onmessage = event => {
            const message = JSON.parse(event.data)
            handleWebSocketMessage(message)
        }
    }, [])

    function toggleAudio() {
        if (audioState) {
            let my_stream = userStreams[UserData.id]

            if (my_stream) {
                Object.keys(peerConnections.current).forEach(id => {
                    if (id === UserData.id)
                        return

                    peerConnections.current[id].removeTrack(audioStreamSent.current[id])
                    audioStreamSent.current[id] = null

                })

                my_stream.getAudioTracks().forEach(audioTrack => {
                    audioTrack.stop()
                    my_stream.removeTrack(audioTrack)
                })

            }

            setUserStreams(currentStreams => {
                return {
                    ...currentStreams,
                    [UserData.id]: my_stream
                }
            })
            setAudioState(false)
        }
        else {
            let my_stream = userStreams[UserData.id]

            if (!my_stream)
                my_stream = new MediaStream()

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {

                    const audioStreamTracks = stream.getAudioTracks()
                    my_stream.addTrack(audioStreamTracks[0])

                    Object.keys(peerConnections.current).forEach(id => {
                        if (id === UserData.id)
                            return

                        if (!audioStreamSent.current[id])
                            audioStreamSent.current[id] = peerConnections.current[id].addTrack(audioStreamTracks[0], stream)
                    })

                    setUserStreams(currentStreams => {
                        return {
                            ...currentStreams,
                            [UserData.id]: my_stream
                        }
                    })
                    setAudioState(true)
                })
        }
    }

    function toggleVideo() {
        if (videoState) {
            let my_stream = userStreams[UserData.id]
            if (my_stream) {

                Object.keys(peerConnections.current).forEach(id => {
                    if (id === UserData.id)
                        return

                    if (videoStreamSent.current[id])
                        peerConnections.current[id].removeTrack(videoStreamSent.current[id])

                    videoStreamSent.current[id] = null

                })

                my_stream.getVideoTracks().forEach(videoTrack => {
                    videoTrack.stop()
                    my_stream.removeTrack(videoTrack)
                })

            }

            setUserStreams(currentStreams => {
                return {
                    ...currentStreams,
                    [UserData.id]: my_stream
                }
            })

            setVideoState(false)
        }
        else {
            let my_stream = userStreams[UserData.id]
            if (!my_stream)
                my_stream = new MediaStream()

            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {

                    const videoStreamTracks = stream.getVideoTracks()
                    my_stream.addTrack(videoStreamTracks[0])

                    Object.keys(peerConnections.current).forEach(id => {
                        if (id === UserData.id)
                            return

                        if (!videoStreamSent.current[id]) {
                            peerConnections.current[id].getSenders().forEach(sender => {
                                peerConnections.current[id].removeTrack(sender)
                            })
                            videoStreamSent.current[id] = peerConnections.current[id].addTrack(videoStreamTracks[0], stream)
                        }
                    })

                    setUserStreams(currentStreams => {
                        return {
                            ...currentStreams,
                            [UserData.id]: my_stream
                        }
                    })
                    setVideoState(true)
                })
        }
    }

    function handleWebSocketMessage(message) {
        const type = message.type
        const data = message.data

        switch (type) {
            case CALL_CONNECTED:
                callPeers(data)
                break

            case OFFER:
                handleOfferMessage(data)
                break

            case ANSWER:
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
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        }

    ]

    function callPeers(peers) {
        const offerRequests = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1,
        }

        peers.forEach(peer => {
            if (peer.id === UserData.id)
                return

            if (!peerConnections.current[peer.id])
                peerConnections.current[peer.id] = createPeer(peer.id)

            peerConnections.current[peer.id]
                .createOffer(offerRequests)
                .then(offer => {
                    return peerConnections.current[peer.id].setLocalDescription(offer)
                })
                .then(() => {
                    sendWebSocketMessage({
                        type: "OFFER",
                        message: {
                            targetID: peer.id,
                            senderID: UserData.id,
                            sdp: peerConnections.current[peer.id].localDescription
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
            let participantStream = userStreams[targetID]

            if (!participantStream)
                participantStream = new MediaStream()

            participantStream.addTrack(event.track)

            setUserStreams(currentStreams => {
                return {
                    ...currentStreams,
                    [targetID]: participantStream
                }
            })
        }
    }

    function handleRemoveStreamEvent(targetID) {
        return event => {
            setUserStreams(currentStreams => {
                return {
                    ...currentStreams,
                    [targetID]: event.stream
                }
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

        if ((targetID !== UserData.id) || (senderID === UserData.id))
            return

        const description = new RTCSessionDescription(sdp)

        if (!peerConnections.current[senderID])
            peerConnections.current[senderID] = createPeer(senderID)

        peerConnections.current[senderID]
            .setRemoteDescription(description)
            .then(() => {
                if (userStreams[UserData.id]) {
                    if (!audioStreamSent.current[senderID]) {
                        const audioStreamTracks = userStreams[UserData.id].getAudioTracks()
                        if (audioStreamTracks.length > 0)
                            audioStreamSent.current[senderID] = peerConnections.current[senderID].addTrack(audioStreamTracks[0], userStreams[UserData.id])
                    }

                    if (!videoStreamSent.current[senderID]) {
                        const videoStreamTracks = userStreams[UserData.id].getVideoTracks()
                        if (videoStreamTracks.length > 0) {
                            videoStreamSent.current[senderID] = peerConnections.current[senderID].addTrack(videoStreamTracks[0], userStreams[UserData.id])
                        }
                    }
                }
            })
            .then(() => {
                return peerConnections.current[senderID].createAnswer()
            })
            .then(answer => {
                return peerConnections.current[senderID].setLocalDescription(answer)
            })
            .then(() => {
                sendWebSocketMessage({
                    type: "ANSWER",
                    message: {
                        targetID: senderID,
                        senderID: UserData.id,
                        sdp: peerConnections.current[senderID].localDescription
                    }
                })
            })
            .catch(error => console.log("Offer Handling, ", error))
    }

    function handleAnswerMessage(message) {
        const { targetID, senderID, sdp } = message

        if (targetID !== UserData.id)
            return

        const description = new RTCSessionDescription(sdp)

        peerConnections.current[senderID]
            .setRemoteDescription(description)
            .then(() => { })
            .catch((error) => { console.log("Answer Handling ", error) })
    }

    function handleIceCandidiateMessage(message) {
        if (message.targetID !== UserData.id)
            return

        const ice_candidiate = new RTCIceCandidate(message.candidate)

        peerConnections.current[message.senderID]
            .addIceCandidate(ice_candidiate)
            .then(() => { })
            .catch(error => console.log("Ice candidate handling error", error))
    }

    //      END OF FUNCTIONS FOR HANDLING RTC SIGNALLING EVENTS     //



    function leaveRoom() {
        window.location = routeHome()
    }

    return (
        <div className={classes.root}>
            <div className={classes.videoChat}>
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
                <br />
                <br />

                <Videos userStreams={userStreams} />
            </div>
            <div className={classes.chat}>
                CHAT HERE
                {/* <Chat /> */}
            </div>
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