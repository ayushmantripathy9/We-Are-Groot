import {
    makeStyles,
    AppBar,
    Typography,
    Toolbar,
    Avatar,
    CssBaseline,
    Fab,
    Menu,
    MenuItem,
    Button
} from "@material-ui/core"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { changeTheme } from "../../actions/theme"

import IconButton from '@material-ui/core/IconButton'
import Brightness3Icon from "@material-ui/icons/Brightness3"
import Brightness7Icon from "@material-ui/icons/Brightness7"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from "axios"
import { apiLogout, routeHome } from "../../urls"
import { userLogout } from "../../actions/user"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: "48px"
    },
    title: {
        flexGrow: 1,
    },
    navStart: {
        display: "grid",
        gridTemplateColumns: "45% 40% 15%",
        width: "97%"
    },
    navEnd: {
        display: "flex",
        width: "3%"
    },
    menu: {
        "& .MuiPaper-root": {
            backgroundColor: "transparent",
            padding: "0rem",
            boxShadow: "none"
        },
    }
}))



function NavBarTop() {
    const UserInfo = useSelector(state => state.userInfo)
    const classes = useStyles()
    const dispatch = useDispatch()

    const [themeState, setThemeState] = useState(false)
    const icon = !themeState ? <Brightness7Icon /> : <Brightness3Icon />

    const [anchorEl, setAnchorEl] = useState(null)
    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    function handleUserLogout() {
        dispatch(userLogout())
    }

    function handleThemeChange() {
        setThemeState(!themeState)
        dispatch(changeTheme(themeState))
    }


    if (UserInfo.login === false) {
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Groot
                        </Typography>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="mode"
                            onClick={handleThemeChange}
                        >
                            {icon}
                        </IconButton>
                    </Toolbar>

                </AppBar>


            </div>
        )
    }
    else {
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="absolute">
                    <Toolbar>
                        <div className={classes.navStart}>
                            <Fab
                                size="small"
                                onClick={handleAvatarClick}
                            >
                                <Avatar 
                                    alt={UserInfo.data.name} 
                                    src={UserInfo.data.profile_pic} 
                                />

                            </Fab>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: "right",
                                    horizontal: "right"
                                }}
                                getContentAnchorEl={null}
                                anchorPosition={{
                                    top:200,
                                    left:400
                                }}
                                
                                className={classes.menu}
                            >

                                <Button
                                    onClick={handleUserLogout}
                                    color="default"
                                    style={{
                                        backgroundColor: "green",
                                        padding: "0.6rem",
                                        textTransform: 'none'
                                    }}
                                    size="small"
                                    endIcon={<ExitToAppIcon />}
                                >
                                    Logout
                                </Button>
                            </Menu>

                            <Typography variant="h6" className={classes.title}>
                                Groot Meetings
                            </Typography>
                        </div>
                        <div className={classes.navEnd}>
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="mode"
                                onClick={handleThemeChange}
                            >
                                {icon}
                            </IconButton>
                        </div>
                    </Toolbar>

                </AppBar>


            </div>
        )
    }
}


export default NavBarTop

