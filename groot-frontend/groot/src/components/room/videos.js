import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"

import { 
    Grid, 
    makeStyles,
    Card,
    CardMedia,
    CardContent
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    card:{
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
}))


function Videos(props) {
    const classes = useStyles();
    const[videoPresent,setVideoPresent] = useState(false)
    useEffect(() => {
        Object.keys(props.videoStreams).forEach(id => {
            if(props.videoStreams[id]) {
                const videoElement = document.getElementById(`video-${id}`)
                const tracks = props.videoStreams[id].getTracks()
                if(tracks.length > 0 && !!videoElement){
                    videoElement.srcObject = props.videoStreams[id]
                    
                }
                setVideoPresent(true)
            }
        })

        console.log(props.videoStreams)
    }, [props.videoStreams])

    if(videoPresent){
        return(
            <div className={classes.root}>

                <Grid container spacing={3}>
                    {
                        Object.keys(props.videoStreams).map(id => {
                            return(

                                <div>
                                    <Card className={classes.card}>
                                        <CardContent>
                                            {props.RoomInfo.participants[id].name}
                                        </CardContent>
                                        <CardMedia
                                            component='video' 
                                            muted={id === props.UserInfo.data.id}
                                            className={classes.media}
                                            autoPlay
                                            id={`video-${id}`}
                                        />

                                    </Card>
                                </div>
                                
                            )
                        })
                    }


                </Grid>

            </div>
        )
    }
    else{
        return (
            <div>
                No Turned On Videos

            </div>
        )
    }
}


function mapStateToProps(state) {
    const { roomInfo, userInfo } = state
    return {
        RoomInfo: roomInfo,
        UserInfo: userInfo
    }
}

export default connect(mapStateToProps)(Videos)