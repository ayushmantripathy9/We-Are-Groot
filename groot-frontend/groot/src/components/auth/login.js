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

import groot_logo from "./media/groot_final.png"

const handleGithubLogin = () => {
    window.location = githubAuthRedirect(cookie.load('stateToken'))
}

const handleGoogleLogin = () => {
    window.location = googleAuthRedirect(cookie.load('stateToken'))
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: "91.55vh",
    },
    illustrationContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "space-around",
        padding: "0"
    },
    loginContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "space-around",
        width: "100%"
    },
    card: {
        maxWidth: 345,
        justifyContent: "center",
        alignItems: "center",
    },


}))


export default function Login() {
    const classes = useStyles()
    const theme =
        createMuiTheme({
            palette: {
                type: 'dark'
            }
        })

    useEffect(() => {
        cookie.remove('stateToken')
        cookie.save('stateToken', randomstring.generate({ charset: 'alphabetic' }))
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Grid container component='main' className={classes.root}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={false}
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
                            <CardContent>
                                Groot says Hello
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
                            item
                            className={classes.loginContainer}
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
                                    color="secondary"
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
        </ThemeProvider >
    );
}