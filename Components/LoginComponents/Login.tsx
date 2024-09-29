"use client"
import Password from "./Password";
import UserName from "./UserName";
import "./Login.css"
import { useState } from "react";
import axios from "axios";


export default function Login() {
    const [email, setEmail] = useState<String>("")
    const [password, setPassword] = useState<String>("")

    async function login(e: any) {
        const resp =  await axios("")
        
        

    }

    return <div className = "loginContainer">
            <UserName props={{email, setEmail}} />
            <Password props={{password, setPassword}}/>
            <div className="d-grid gap-2">
                <button
                    type="button"
                    name=""
                    className="btn btn-primary"
                    onClick={login}
                >
                    Login
                </button>
            </div>
            
            <hr className="hr-text" data-content="or"/>

            <div className="d-grid gap-2">
                <button
                    type="button"
                    name=""
                    className="btn btn-primary"
                >
                    Sign Up
                </button>
            </div>
            
        </div>
}