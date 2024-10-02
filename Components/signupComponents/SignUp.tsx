"use client"
import axios from "axios"
import { redirect } from "next/dist/server/api-utils/index"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Input from "../CommonComponents/Input"
import "./SignUp.css"


export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [publickey, setPublicKey] = useState("")
    const [privatekey, setPrivatekey] = useState("")
    const router = useRouter()

    function onsubmit(e: any) {
        console.log(e)
        axios.post("https://tokenlaunchpad-backend-server.vercel.app/api/user/signup", {
            email: email,
            password: password,
            publickey: publickey,
            privatekey: privatekey
        }).then((res)=>{
            alert("Successfully signup")
            router.push("/")
        }).catch(()=>{
            alert("Error in signing up please tryagain")
            setEmail("")
            setPassword("")
            setPrivatekey("")
            setPublicKey("")
        })

    }

    return (<div className="signupContainer">
            <Input props={{value: email, onchange: (e: any)=>{
                const value = e.target.value
                setEmail(value)
            }, placeholder: "Enter Email"}}/>
            <Input props={{value: password, onchange: (e: any)=>{
                const value = e.target.value
                setPassword(value)
            }, placeholder: "Enter passowrd"}}/>
            <Input props={{value: publickey, onchange: (e: any)=>{
                const value = e.target.value
                setPublicKey(value)
            }, placeholder: "Enter Public key"}}/>
            <Input props={{value: privatekey, onchange: (e: any)=>{
                const value = e.target.value
                setPrivatekey(value)
            }, placeholder: "Enter Private key"}}/>
            <div className="d-grid gap-2">
                <button
                    type="button"
                    name=""
                    className="btn btn-primary"
                    onClick={onsubmit}
                >
                    Sign Up
                </button>
            </div>
        </div>)

}