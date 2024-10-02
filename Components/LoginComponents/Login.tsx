"use client"
import Password from "./Password";
import UserName from "./UserName";
import "./Login.css"
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";




export default function Login() {
    const [email, setEmail] = useState<String>("")
    const [password, setPassword] = useState<String>("")
    const router=useRouter()

    function login(e: any) {
        axios.post("https://tokenlaunchpad-backend-server.vercel.app/api/user/signin", {
            email: email,
            password: password
        }).then((resp)=>{
            const token = resp.data.token
            //MARK: Add redie
        }).catch((err)=>{
            alert("Error in fetching details")
        })
    }

    function signup(e: any) {
        router.push("/signup")
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
                    onClick={signup}
                >
                    Sign Up
                </button>
            </div>
            
        </div>
}