import { githubAuthRedirect, googleAuthRedirect } from "../../urls"

import cookie from 'react-cookies'
import randomstring from 'randomstring'
import { useEffect } from "react"

import Button from '@material-ui/core/Button'
import {
    makeStyles,
    createMuiTheme,
    CssBaseline,
    Grid,
    Paper,
    Card,
    CardContent,
    CardMedia,
} from "@material-ui/core"
import { ThemeProvider } from "@material-ui/styles";

import GitHubIcon from '@material-ui/icons/GitHub'
import BubbleChartIcon from '@material-ui/icons/BubbleChart';

import groot_logo from "./media/groot_landing_logo.png"

const handleGithubLogin = () => {
    window.location = githubAuthRedirect(cookie.load('stateToken'))
}

const handleGoogleLogin = () => {
    window.location = googleAuthRedirect(cookie.load('stateToken'))
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: "92.25vh",
        alignItems: "center",
        justifyContent: "center",
        paddingRight: "1rem",
        paddingTop: "1rem",
    },
    illustrationContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    paper: {
        display: "flex",
        height: "98%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "space-around",
        backgroundColor: "black"
    },
    card: {
        maxWidth: 345,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    main:{
        paddingTop:"0.5rem"
    }


}))


export default function Login() {
    const classes = useStyles()

    useEffect(() => {
        cookie.remove('stateToken')
        cookie.save('stateToken', randomstring.generate({ charset: 'alphabetic' }))
    }, [])

    return (
            <div className={classes.main}>
                <Grid container component='main' className={classes.root}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={7}
                        className={classes.illustrationContainer}
                    >
                        <Card
                            className={classes.card}
                        >
                            <CardMedia
                                style={{ height: 200, width:150, paddingTop: '56.25%' }}
                                image={groot_logo}
                                title="Groot"
                            />
                            <CardContent alignItems="center" >
                                <i>Groot says Hello ...</i>
                            </CardContent>

                        </Card>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={5}
                        component={Paper}
                        className={classes.paper}
                    >
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            spacing={3}
                        >
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleGithubLogin}
                                    startIcon={<GitHubIcon />}
                                >
                                    Login With GitHub
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleGoogleLogin}
                                    startIcon={<BubbleChartIcon />}
                                >
                                    Login With Google
                                </Button>
                            </Grid>

                        </Grid>

                    </Grid>


                </Grid>






            </div>
    );
}