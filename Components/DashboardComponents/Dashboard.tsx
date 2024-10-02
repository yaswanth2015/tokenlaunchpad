"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Input from "../CommonComponents/Input"
import Password from "../LoginComponents/Password"
import "./Dashboard.css"

interface Dashboard {
    privatekey: string,
    publickey: string,
    ownedmintAccounts: string[]
}


export default function Dashboard() {
    const token = localStorage.getItem("tokenlaunchpadToken")
    const [dashboard, setDashBoard] = useState<Dashboard>({
        privatekey: "",
        publickey: "",
        ownedmintAccounts: []
    })
    const router = useRouter()
    useEffect(()=>{
        axios.get("https://tokenlaunchpad-backend-server.vercel.app/api/user/keys", {
            'headers' : {
                'token': token
            }
        }).then((resp)=>{
            const data: Dashboard = {
                publickey: resp.data.publickey,
                privatekey: resp.data.privatekey,
                ownedmintAccounts: dashboard.ownedmintAccounts
            }
            setDashBoard(data)
        }).catch((error)=> {
            alert("Error in Fetching details Re Login or wait for sometime")
            router.push("/")
        })
    }, [])
    

    return (<div className="dashBoardContainer">
    <>
        <h3>Private Key</h3>
        <Password props = {{password: dashboard.privatekey, disable: true}}/>
        <h3>Public Key</h3>
        <Input props = {{placeholder: "Public Key", value: dashboard.publickey, onchange: ()=>{}, disable: true}}/>
        <h4>Owned Mint Accounts</h4>
        {dashboard.ownedmintAccounts.forEach((ownedAccountAddress, index, arr)=>{
            <Input id={index} props = {{placeholder: "Mint Account", value: ownedAccountAddress, onchange: ()=>{}, disable: true}}/>
        })}
    </>
</div>)
}