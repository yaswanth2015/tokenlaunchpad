"use client"
import { useState } from "react"
import Input from "../CommonComponents/Input"
import "./SignUp.css"


export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [publickey, setPublicKey] = useState("")
    const [privatekey, setPrivatekey] = useState("")

    function onsubmit(e: any) {

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
                    onSubmit={onsubmit}
                >
                    Sign Up
                </button>
            </div>
        </div>)

}