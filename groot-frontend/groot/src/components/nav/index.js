import {
    makeStyles,
    AppBar,
    Typography,
    Toolbar,
    Avatar
} from "@material-ui/core"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { changeTheme } from "../../actions/theme"

import IconButton from '@material-ui/core/IconButton'
import Brightness3Icon from "@material-ui/icons/Brightness3"
import Brightness7Icon from "@material-ui/icons/Brightness7"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    navStart: {
        display: "grid",
        gridTemplateColumns:"45% 40% 15%",
        width: "97%"
    },
    navEnd: {
        display: "flex",
        width: "3%"
    }
}))

function NavBarTop() {
    const UserInfo = useSelector(state => state.userInfo)
    const classes = useStyles()
    const dispatch = useDispatch()

    const [themeState, setThemeState] = useState(false)
    const icon = !themeState ? <Brightness7Icon /> : <Brightness3Icon />

    function handleThemeChange() {
        setThemeState(!themeState)
        dispatch(changeTheme(themeState))
        console.log(themeState)
    }

    if (UserInfo.login === false) {
        return (
            <div className={classes.root}>
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
                <AppBar position="absolute">
                    <Toolbar>
                        <div className={classes.navStart}>
                            <Avatar alt={UserInfo.data.name} src={UserInfo.data.profile_pic}>

                            </Avatar>
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

