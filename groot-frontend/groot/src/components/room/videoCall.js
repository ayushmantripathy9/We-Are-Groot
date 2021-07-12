import { makeStyles } from "@material-ui/core"
import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { apiWSCall, routeHome } from "../../urls"

import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import FileCopyIcon from '@material-ui/icons/FileCopy'

import {
    Button
} from "@material-ui/core"


import {
    ANSWER,
    AUDIO_OFF,
    CALL_CONNECTED,
    ICE_CANDIDATE,
    OFFER,
    PARTICIPANT_LEFT,
    VIDEO_OFF
} from "./messageTypes/signalling"

import Videos from "./videos"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "88.75vh",
        display: "grid",
        gridTemplateRows: "20fr 1fr",
        paddingTop: "1rem"
    },
    videos: {

    },
    controls: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    joiningInfo:{
        paddingRight:"2rem",
    },
    button: {
        margin: theme.spacing(0.5),
    }

}))

function VideoCall(props) {

    const UserData = props.UserInfo.data
    let [audioState, setAudioState] = useState(false)
    let [videoState, setVideoState] = useState(false)

    const peerConnections = useRef({})  // all the peer-connections for sharing video and audio to all users
    const videoStreamSent = useRef({})
    const audioStreamSent = useRef({})

    // let [userStreams, setUserStreams] = useState({})    // would contain all the video streams of all users 
    const userStreams = useRef({})    // would contain all the video streams of all users 

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
            // Turning video off
            // let stream  = userStreams[UserData.id]
            let stream  = userStreams.current[UserData.id]
            if (stream) {
                console.log("SEnding audio off", UserData.id)
                sendWebSocketMessage({
                    type: AUDIO_OFF,
                    message: UserData.id
                })

                Object.keys(peerConnections.current).forEach(id => {
                    if (id === UserData.id) return

                    if (peerConnections.current[id] && audioStreamSent.current[id]) {
                        peerConnections.current[id].removeTrack(audioStreamSent.current[id])
                    }

                    delete audioStreamSent.current[id]
                })

                stream.getAudioTracks().forEach(t => {
                    t.stop()
                    stream.removeTrack(t)
                })

                // setUserStreams(streams => ({
                //     ...streams,
                //     [UserData.id]: stream
                // }))
                userStreams.current = {
                    ...userStreams.current,
                    [UserData.id]: stream
                }
                setAudioState(false)
            }

        } else {
            // Turning video on

            navigator.mediaDevices.getUserMedia({audio: true})
                .then(stream => {
                    // let myStream = userStreams[UserData.id]
                    let myStream = userStreams.current[UserData.id]
                    if (!myStream) myStream = new MediaStream()

                    let audioTracks = stream.getAudioTracks()
                    
                    if (audioTracks.length === 0) return

                    myStream.addTrack(audioTracks[0])

                    Object.keys(peerConnections.current).forEach(id => {
                        if (peerConnections.current[id] && !audioStreamSent.current[id]) {
                            audioStreamSent.current[id] = peerConnections.current[id].addTrack(audioTracks[0], myStream)
                        }
                    })

                    // setUserStreams(streams => ({
                    //     ...streams,
                    //     [UserData.id]: myStream
                    // }))
                    userStreams.current = {
                        ...userStreams.current,
                        [UserData.id]: myStream
                    }
                    setAudioState(true)
                })
        }
    }

    function toggleVideo() {
        if (videoState) {
            // Turning video off
            let stream  = userStreams[UserData.id]
            if (stream) {
                console.log("SEnding video off", UserData.id)
                sendWebSocketMessage({
                    type: VIDEO_OFF,
                    message: UserData.id
                })

                Object.keys(peerConnections.current).forEach(id => {
                    if (id === UserData.id) return

                    if (peerConnections.current[id] && videoStreamSent.current[id]) {
                        peerConnections.current[id].removeTrack(videoStreamSent.current[id])
                    }

                    delete videoStreamSent.current[id]
                })

                stream.getVideoTracks().forEach(t => {
                    t.stop()
                    stream.removeTrack(t)
                })

                // setUserStreams(streams => ({
                //     ...streams,
                //     [UserData.id]: stream
                // }))
                userStreams.current = {
                    ...userStreams.current,
                    [UserData.id]: stream
                }
                setVideoState(false)
            }

        } else {
            // Turning video on

            navigator.mediaDevices.getUserMedia({video: true})
                .then(stream => {
                    let myStream = userStreams[UserData.id]
                    if (!myStream) myStream = new MediaStream()

                    let videoTracks = stream.getVideoTracks()
                    
                    if (videoTracks.length === 0) return

                    myStream.addTrack(videoTracks[0])

                    Object.keys(peerConnections.current).forEach(id => {
                        if (peerConnections.current[id] && !videoStreamSent.current[id]) {
                            videoStreamSent.current[id] = peerConnections.current[id].addTrack(videoTracks[0], myStream)
                        }
                    })

                    // setUserStreams(streams => ({
                    //     ...streams,
                    //     [UserData.id]: myStream
                    // }))
                    userStreams.current = {
                        ...userStreams.current,
                        [UserData.id]: myStream
                    }

                    setVideoState(true)
                })
        }
    }

    function handleUserVideoOff (userID) {
        let stream = userStreams[userID]
        console.log("STREAMMMMMMMMM VIDEO", stream)
        if (stream) {
            console.log("Video off stream exists")
            stream.getVideoTracks().forEach(t => {
                console.log(`Stopping video track for ${userID}`)
                t.stop()
                stream.removeTrack(t)
            })

            // setUserStreams(streams => ({
            //     ...streams,
            //     [userID]: stream
            // }))
            userStreams.current = {
                ...userStreams.current,
                [userID]: stream
            }
        }
    }

    function handleUserAudioOff (userID) {
        let stream = userStreams[userID]
        console.log("STREAMMMMMMMMM AUDIO", stream)
        if (stream) {
            console.log("Audio off stream exists")
            stream.getAudioTracks().forEach(t => {
                console.log(`Stopping audio track for ${userID}`)
                t.stop()
                stream.removeTrack(t)
            })

            // setUserStreams(streams => ({
            //     ...streams,
            //     [userID]: stream
            // }))
            userStreams.current = {
                ...userStreams.current,
                [userID]: stream
            }
        }
    }

    function handleWebSocketMessage(message) {
        const type = message.type
        const data = message.data

        // console.log("type", type, "data", data)

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
            case VIDEO_OFF:
                handleUserVideoOff(data)
                break
            case AUDIO_OFF:
                handleUserAudioOff(data)
                break

            // case PARTICIPANT_LEFT:
            //     let new_pc_dict = peerConnections.current
            //     delete new_pc_dict[data.id]
            //     peerConnections.current = new_pc_dict

            //     let new_vc_dict = videoStreamSent.current
            //     delete new_vc_dict[data.id]
            //     videoStreamSent.current = new_vc_dict

            //     console.log("New Peer Connections State", peerConnections.current)
            //     break

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
    ]

    function callPeers(peers) {
        peers.forEach(user => {
            if (user.id === UserData.id) return

            if (!peerConnections.current[user.id])
                peerConnections.current[user.id] = createPeer(user.id)
            
            peerConnections.current[user.id].onnegotiationneeded()
        })
    }

    function createPeer(targetID) {
        let peer = new RTCPeerConnection({iceServers})

        peer.onnegotiationneeded = handleNegotiationNeededEvent(peer, targetID)
        peer.onicecandidate = handleIceCandidateEvent(targetID)
        peer.ontrack = handleTrackEvent(targetID)
        
        return peer
    }

    //      FUNCTIONS FOR CREATING THE PEER CONNECTIONS     //

    function handleNegotiationNeededEvent(peer, targetID) {
        const offerOptions = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        }

        return event => {
            peer.createOffer(offerOptions)
                .then(offer => {
                    return peer.setLocalDescription(offer)
                })
                .then(() => {
                    sendWebSocketMessage({
                        type: OFFER,
                        message: {
                            targetID,
                            senderID: UserData.id,
                            sdp: peer.localDescription
                        }
                    })
                })
                .catch(e => {
                    console.log("Error sending offer", e)
                })
        }
    }

    function handleTrackEvent(targetID) {
        return event => {

            let stream = userStreams[targetID]
            console.log(stream)

            if (!stream){
                stream = new MediaStream()
                console.log("New stream created")
            }

            stream.addTrack(event.track)
            console.log(`Added track for ${targetID}`)
            // setUserStreams(streams => ({
            //     ...streams,
            //     [targetID]: stream
            // }))
            userStreams.current = {
                ...userStreams.current,
                [targetID]: stream
            }
        }  
    }

    function handleIceCandidateEvent(targetID) {
        return event => {

            if (event.candidate) {
                // console.log("New ICE Candidate")
                sendWebSocketMessage({
                    type: ICE_CANDIDATE,
                    message: {
                        targetID,
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
        if (targetID !== UserData.id) return
        
        if(!peerConnections.current[senderID])
            peerConnections.current[senderID] = createPeer(senderID)
        
        const desc = new RTCSessionDescription(sdp)

        peerConnections.current[senderID]
            .setRemoteDescription(desc)
            .then(() => {
                // console.log("Creating answer")
                return peerConnections.current[senderID].createAnswer()
            })
            .then(answer => {
                // console.log("Setting answer as local description")
                return peerConnections.current[senderID].setLocalDescription(answer)
            })
            .then(() => {
                // console.log("sending answer")
                sendWebSocketMessage({
                    type: ANSWER,
                    message: {
                        targetID: senderID,
                        senderID: UserData.id,
                        sdp: peerConnections.current[senderID].localDescription
                    }
                })
            })
            .catch(e => {
                console.log("Error sending answer", e)
            })
    }

    function handleAnswerMessage(message) {
        const { targetID, senderID, sdp } = message
        if (targetID !== UserData.id) return
        
        const answer = new RTCSessionDescription(sdp)

        peerConnections.current[senderID]
            .setRemoteDescription(answer)
            .then(() => {
                // console.log("Setting answer as remote description")
            })
            .catch(() => {})
    }

    function handleIceCandidiateMessage(message) {
        const { targetID, senderID, candidate } = message
        if (targetID !== UserData.id) return
        
        const c = new RTCIceCandidate(candidate)
        if (peerConnections.current[senderID])
            peerConnections.current[senderID].addIceCandidate(c).then(()=>{
                // console.log("Received ICE candidate")
            })
    }

    //      END OF FUNCTIONS FOR HANDLING RTC SIGNALLING EVENTS     //



    function leaveRoom() {
        window.location = routeHome()
    }

    function handleCopyJoiningInfo() {
        navigator.clipboard.writeText(props.RoomInfo.room_code)
    }
    return (
        <div className={classes.root}>

            <div className={classes.videos}>
                <Videos userStreams={userStreams} />

            </div>

            <div className={classes.controls}>

                <div>
                    <Button
                        startIcon={videoState ? <VideocamIcon /> : <VideocamOffIcon />}
                        color="secondary"
                        onClick={toggleVideo}
                    />


                    <Button
                        startIcon={audioState ? <MicIcon /> : <MicOffIcon />}
                        color="secondary"
                        onClick={toggleAudio}
                    />

                    <Button
                        startIcon={<ExitToAppIcon />}
                        color="secondary"
                        onClick={leaveRoom}
                    />
                </div>
                <div className={classes.joiningInfo}>
                    <Button
                        color="default"
                        endIcon={<FileCopyIcon />}
                        style={{
                            backgroundColor:"green",
                            padding: "0.6rem",
                            textTransform: 'none'
                        }}
                        onClick={handleCopyJoiningInfo}
                    >
                        Copy Room Code
                    </Button>

                </div>
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