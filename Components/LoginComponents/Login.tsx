"use client"
import Password from "./Password";
import UserName from "./UserName";
import "./Login.css"
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { redirect } from "next/dist/server/api-utils/index";




export default function Login() {
    const [email, setEmail] = useState<String>("")
    const [password, setPassword] = useState<String>("")
    const router=useRouter()

    function login(e: any) {
        axios.post("https://tokenlaunchpad-backend-server.vercel.app/api/user/signin", {
            email: email,
            password: password
        }).then((resp)=>{
            const token:string = resp.data.token as string
            localStorage.setItem("tokenlaunchpadToken", token)
            router.push("/dashboard")
        }).catch((err)=>{
            alert("Error in fetching details")
        })
    }

    function signup(e: any) {
        router.push("/signup")
    }

    return <div className = "loginContainer">
            <UserName props={{email, setEmail}} />
            <Password props={{password: password, onchange: (e:any)=>{
                const value = e.target.value
                setPassword(value)
            }}}/>
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