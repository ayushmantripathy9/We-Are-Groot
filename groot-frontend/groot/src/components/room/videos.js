import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"

import {
    Grid,
    makeStyles,
    Card,
    CardMedia,
    CardContent,
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    card: {
        maxWidth: 345,
    },
    media: {
        height: 175,
    },
}))


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
                else{
                    console.log("Tracks not found 1 ",props.RoomInfo.participants[id].name)
                    videoElement.srcObject = null
                }
            }
            else{
                console.log("Tracks not found 2 ", props.RoomInfo.participants[id].name)
                const videoElement = document.getElementById(`video-${id}`)
                videoElement.srcObject = null
            }
        })

    }, [props.userStreams])


    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                {
                    Object.keys(props.RoomInfo.participants).map(id => {
                        return (

                            <div>
                                <Grid item xs>
                                    <Card className={classes.card}>

                                        <CardContent>
                                            {props.RoomInfo.participants[id].name}
                                        </CardContent>

                                        <video 
                                            id={`video-${id}`}
                                            autoPlay
                                            muted={id === props.UserInfo.data.id}
                                            className={classes.media}
                                            height="175"
                                        />

                                    </Card>
                                </Grid>
                            </div>

                        )
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