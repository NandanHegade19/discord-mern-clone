import { Button } from '@material-ui/core'
import React from 'react'
import './Login.css'
import { auth, provider } from './firebase'

const Login = () => {
    const signIn = () => {
        auth.signInWithPopup(provider).catch((err) => alert(err.message))
    }
    return (
        <div className = "loginpage">
            <img src="https://www.freepnglogos.com/uploads/discord-logo-png/discord-branding-2.png" alt="discord logo" />
            <Button onClick={signIn}>Sign In</Button>
        </div>
    )
}

export default Login
