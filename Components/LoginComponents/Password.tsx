"use client"
import { useState } from "react";

export default function Password({props}: any) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="input-group mb-3">
            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Enter Password" aria-label="Enter password" aria-describedby="button-addon2" id="login" value={props.password} onChange = {props.onchange} style = {{height: "48px"}} disabled={props.disable}/>
            <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={()=>{
                setShowPassword(!showPassword)
            }}>{showPassword ? "Hide" : "Show"}</button>
        </div>
    )
}