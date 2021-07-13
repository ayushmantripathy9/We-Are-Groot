import { makeStyles } from "@material-ui/core"
import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { apiWSCall, routeHome } from "../../urls"

import {
    Button
} from "@material-ui/core"

// imports for the icons used
import MicIcon from '@material-ui/icons/Mic'
import VideocamIcon from '@material-ui/icons/Videocam'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import AlbumIcon from '@material-ui/icons/Album';

import {
    ANSWER,
    CALL_CONNECTED, 
    ICE_CANDIDATE,
    OFFER,
    PARTICIPANT_LEFT
} from "./messageTypes/signalling"

import Videos from "./videos"
import { Component } from "react"

const moment = require("moment")

// CSS for the VideoCall Component
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
    joiningInfo: {
        paddingRight: "2rem",
    },
    button: {
        margin: theme.spacing(0.5),
    },
    '@keyframes blinker': {
        from: { opacity: 1 },
        to: { opacity: 0 },
    },
    blinking: {
        animationName: '$blinker',
        animationDuration: '1s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
    }

}))
/**
 * The VideoCall Component
 * @param props UserInfo, RoomInfo
 * @returns {Component} VideoCall Component
 * 
 * The component contains:
 *  - Videos Component
 *  - Media Controls
 */
function VideoCall(props) {

    const UserData = props.UserInfo.data                // user-information
    const [audioState, setAudioState] = useState(true)  // the current state of audio (true: on)
    const [videoState, setVideoState] = useState(true)  // the current state of video (true: on)

    const peerConnections = useRef({})  // all the peer-connections for sharing video and audio to all users
    const videoStreamSent = useRef({})  // contains the video-stream sent to each user
    const audioStreamSent = useRef({})  // contains the audio-stream sent to each user

    const [userStreams, setUserStreams] = useState({})    // contains all the video streams of all users
    const myStreamRef = useRef()                          // this is a utility ref that stores user stream, to prevent state-loss on one stream (audio or video) change
    const [initialStream, setInitialStream] = useState(false)

    const [recording, setRecording] = useState(false)   // represents whether the user is recording or not
    const screenRecorder = useRef()                     // ref that contains the screen-recorder utility
    const screenStream = useRef()                       // utility to stop the stop screen sharing after recording is over

    const callWebSocket = useRef()      // the Call WebSocket to handle sending and receiving of all WS messages

    const classes = useStyles()

    useEffect(() => {
        callWebSocket.current = new WebSocket(apiWSCall(props.RoomInfo.room_code))
        callWebSocket.current.onmessage = event => {
            const message = JSON.parse(event.data)
            handleWebSocketMessage(message)
        }

    }, [])

    /**
     * Toggles the current state of Audio
     */
    function toggleAudio() {
        myStreamRef.current.getAudioTracks()[0].enabled = !audioState
        setAudioState(prev => { return !prev })
    }
    /**
     * Toggles the current state of Video
     */
    function toggleVideo() {
        myStreamRef.current.getVideoTracks()[0].enabled = !videoState
        setVideoState(prev => { return !prev })
    }
    /**
     * Handles all messages coming via the Call Web-Socket
     * @param {*} message The Web-Socket message after JSON parse
     */
    function handleWebSocketMessage(message) {
        const type = message.type
        const data = message.data

        switch (type) {
            case CALL_CONNECTED:
                navigator.mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true } }).then(stream => {
                    myStreamRef.current = stream
                    setUserStreams(streams => {
                        return {
                            ...streams,
                            [UserData.id]: stream
                        }
                    })
                }).then(() => {
                    setInitialStream(true)
                    callPeers(data)
                })
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

            case PARTICIPANT_LEFT:
                let new_pc_dict = peerConnections.current
                delete new_pc_dict[data.id]
                peerConnections.current = new_pc_dict

                let new_vc_dict = videoStreamSent.current
                delete new_vc_dict[data.id]
                videoStreamSent.current = new_vc_dict

                let new_ac_dict = audioStreamSent.current
                delete new_ac_dict[data.id]
                audioStreamSent.current = new_ac_dict

                break

            default:
                break
        }
    }
    /**
     * Sends message via the Call Web-Socket
     * @param {*} message message to be sent via the Web-Socket
     */
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
    /**
     * Calls all the participants present in the room. Sets up peer-connections and adds own Media tracks to the same
     * @param {*} peers List of all the peers in the room to call
     */
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

            myStreamRef.current.getTracks().forEach(track => {
                peerConnections.current[peer.id].addTrack(track, myStreamRef.current)
            })
        })
    }

    /**
     * Creates peer-connection with the required user
     * @param {*} targetID User with which the peer-connection is to be set up
     * @returns peer-connection The peer-connection set-up with given peer
     */
    function createPeer(targetID) {

        let peer_connection = new RTCPeerConnection({ iceServers })

        peer_connection.onnegotiationneeded = handleNegotiationNeededEvent(peer_connection, targetID)
        peer_connection.ontrack = handleTrackEvent(targetID)
        peer_connection.onremovestream = handleRemoveStreamEvent(targetID)
        peer_connection.onicecandidate = handleIceCandidateEvent(targetID)

        return peer_connection
    }

    //      FUNCTIONS FOR CREATING THE PEER CONNECTIONS     //

    /**
     * Handles the negotiation needed event that occurs in the peer-connection, triggered by the peer
     * @param {*} peer_connection peer_connection with a specific user
     * @param {*} targetID id of the user with which peer-connection is set up
     * @returns event which handles the handleNegotiationNeededEvent
     */
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

    /**
     * Handles the OnTrack event which occurs whenever a track is received via the peer-connection
     * @param {*} targetID User whose track change cause the event
     * @returns event to handle the OnTrack event
     */
    function handleTrackEvent(targetID) {
        return event => {
            setUserStreams(currentStreams => {
                return {
                    ...currentStreams,
                    [targetID]: event.streams[0]
                }
            })
        }
    }
    /**
     * Handles the RemoveStream event (deprecated now)
     * @param {*} targetID User who caused the event
     * @returns event to handle the RemoveStream event
     */    
    function handleRemoveStreamEvent(targetID) {
        return event => {
            myStreamRef.current = event.stream
            setUserStreams(currentStreams => {
                return {
                    ...currentStreams,
                    [targetID]: event.stream
                }
            })
        }
    }

    /**
     * Handles the IceCandidate event which occurs whenever the peer sends an ice-candidate for signalling
     * @param {*} targetID User who sent the ICE-Candidate
     * @returns event to handle the IceCandidate event
     */    
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

    /**
     * Utility to handle the Offer message received from a peer
     * @param {*} message The Offer Message 
     * 
     * Sets the remoteDescription of the peer-connection to the pertaining to the sdp-offer made in the offer
     * 
     * Sends the answer in reply to the offer, speciying the Local Description
     * and adding any Media Stream tracks for the user (if present)
     * 
     * incoming message (offer) Details:
     *  - targetID: This should match the current userID for offer to be accepted
     *  - senderID: Id of the user who sent the offer
     *  - sdp: Session description of the sender (Local Description)
     */
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
                const my_stream = myStreamRef.current
                if (my_stream) {
                    if (!audioStreamSent.current[senderID]) {
                        const audioStreamTracks = my_stream.getAudioTracks()
                        if (audioStreamTracks.length > 0)
                            audioStreamSent.current[senderID] = peerConnections.current[senderID].addTrack(audioStreamTracks[0], my_stream)
                    }

                    if (!videoStreamSent.current[senderID]) {
                        const videoStreamTracks = my_stream.getVideoTracks()
                        if (videoStreamTracks.length > 0) {
                            videoStreamSent.current[senderID] = peerConnections.current[senderID].addTrack(videoStreamTracks[0], my_stream)
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

    /**
     * Utility to handle the Answer received from a peer in reply to the offer sent
     * @param {*} message The Answer Message 
     * 
     *  Sets the remoteDescription of the peer-connection to the pertaining to the sdp-offer made in the answer
     * 
     *  incoming message(answer) Details:
     *  - targetID: This should match the current userID for answer to be valid
     *  - senderID: Id of the user who sent the answer
     *  - sdp: Session description of the sender (Local Description)
     */    
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

    /**
     * Utility function to copy the room_code of the current room
     */
    function handleCopyJoiningInfo() {
        navigator.clipboard.writeText(props.RoomInfo.room_code)
    }

    /**
     * Utility function to download the recorded media 
     * @param {*} blob The collection of chunks (The recorded media)
     * @param {*} name Name of the recording file to be stored locally 
     * 
     * starts the download of the media automatically
     */
    function downloadBlob(blob, name = `groot-recording(room - ${props.RoomInfo.room_name})-${moment().format('lll')}.mp4`) {
        if (
            window.navigator &&
            window.navigator.msSaveOrOpenBlob
        ) return window.navigator.msSaveOrOpenBlob(blob);

        const data = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = data;
        link.download = name;


        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );

        setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
        }, 100);
    }

    /**
     * Handles the screen recording functionality
     * - Creates a new media recording
     * - Toggles the media recording state
     */
    function handleScreenRecord() {
        if (!recording) {
            navigator.mediaDevices.getDisplayMedia({
                video: {
                    mediaSource: "screen",
                    cursor: "always"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            }).then(stream => {
                screenRecorder.current = new MediaRecorder(stream)
                screenStream.current = stream

                const chunks = []
                screenRecorder.current.ondataavailable = event => chunks.push(event.data)
                screenRecorder.current.onstop = event => {
                    const mediaBlob = new Blob(chunks, { type: chunks[0].type })
                    downloadBlob(mediaBlob)
                }
                screenRecorder.current.start()
            }).then(() => {
                setRecording(prev => {
                    return !prev
                })
            }).catch(()=>{
                return
            })
        }
        else {
            screenRecorder.current.stop()
            screenStream.current.getTracks().forEach(track => track.stop())
            setRecording(prev => {
                return !prev
            })
        }
    }


    return (
        <div className={classes.root}>

            <div className={classes.videos}>
                {initialStream && <Videos userStreams={userStreams} />}

            </div>

            <div className={classes.controls}>

                <div>
                    <Button
                        startIcon={videoState ? <VideocamIcon /> : <VideocamIcon style={{ color: "red" }} />}
                        color="secondary"
                        onClick={toggleVideo}
                    />


                    <Button
                        startIcon={audioState ? <MicIcon /> : <MicIcon style={{ color: "red" }} />}
                        color="secondary"
                        onClick={toggleAudio}
                    />

                    <Button
                        color="secondary"
                        onClick={handleScreenRecord}
                        startIcon={!recording ? <AlbumIcon style={{ color: "" }} /> : <AlbumIcon className={classes.blinking} style={{ color: "red" }} />}
                        title={!recording ? "Start Recording" : "Stop Recording"}
                    />
                    <Button
                        startIcon={<ExitToAppIcon style={{ color: "red" }} />}
                        color="secondary"
                        onClick={leaveRoom}
                        title="Leave Room"
                    />
                </div>
                <div className={classes.joiningInfo}>
                    <Button
                        color="default"
                        endIcon={<FileCopyIcon />}
                        style={{
                            backgroundColor: "green",
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