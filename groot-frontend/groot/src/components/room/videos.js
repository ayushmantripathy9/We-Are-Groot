import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"

import {
    Grid,
    makeStyles,
    Card,
    Avatar,
    CardContent,
} from "@material-ui/core"
import { Component } from "react";

// CSS for the Videos Component
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    card: {
        maxWidth: 375,
        marginRight: "1rem",
        marginBottom: "1rem",
        paddingBottom: "0.4rem",
        paddingRight: "0.7rem",
        paddingLeft: "0.7rem",
        backgroundColor: "black"
    },
    cardContent: {
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: "1rem",
    },
    media: {
        height: 175,
    },
}))

/**
 * The videos component, where all the videos of the video-call are rendered
 * @param {*} props UserStreams, RoomInfo, UserInfo
 * @returns {Component} The Videos Component
 */
function Videos(props) {
    const classes = useStyles();

    useEffect(() => {
        Object.keys(props.RoomInfo.participants).forEach(id => {
            if (props.userStreams[id]) {
                const videoElement = document.getElementById(`video-${id}`)
                const tracks = props.userStreams[id].getTracks()

                if (tracks.length > 0 && !!videoElement) {
                    videoElement.srcObject = props.userStreams[id]
                }
                else {
                    videoElement.srcObject = null
                }
            }
            else {
                const videoElement = document.getElementById(`video-${id}`)
                videoElement.srcObject = null
            }
        })

    }, [props.userStreams])


    return (
        <div className={classes.root}>
            <Grid container spacing={3}>

                <div>
                    <Grid item xs>
                        <Card className={classes.card}>

                            <CardContent className={classes.cardContent}>
                                <div
                                    style={{
                                        paddingTop: "0.3rem"
                                    }}
                                >
                                    {props.UserInfo.data.name}
                                </div>
                                <Avatar src={props.UserInfo.data.profile_pic} />
                            </CardContent>

                            <video
                                id={`video-${props.UserInfo.data.id}`}
                                autoPlay
                                muted
                                className={classes.media}
                                height="175"
                                width="275"
                            />

                        </Card>
                    </Grid>
                </div>

                {


                    Object.keys(props.RoomInfo.participants).map(id => {
                        if(id != props.UserInfo.data.id){
                            return (

                                <div>
                                    <Grid item xs>
                                        <Card className={classes.card}>

                                            <CardContent className={classes.cardContent}>
                                                <div
                                                    style={{
                                                        paddingTop: "0.3rem"
                                                    }}
                                                >
                                                    {props.RoomInfo.participants[id].name}
                                                </div>
                                                <Avatar src={props.RoomInfo.participants[id].profile_pic} />
                                            </CardContent>

                                            <video
                                                id={`video-${id}`}
                                                autoPlay
                                                className={classes.media}
                                                height="175"
                                                width="275"
                                            />

                                        </Card>
                                    </Grid>
                                </div>

                            )
                        }
                    })
                }


            </Grid>


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

export default connect(mapStateToProps)(Videos)