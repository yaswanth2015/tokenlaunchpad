"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Input from "../CommonComponents/Input"
import Password from "../LoginComponents/Password"
import "./Dashboard.css"
import * as solana from "@solana/web3.js"
import Button from "../CommonComponents/button"
import * as solanaToken from "@solana/spl-token"
import * as Constants from "../../Constants"
import * as base58 from "bs58"

interface Dashboard {
    privatekey: string,
    publickey: string,
    solbalance: number
    ownedmintAccounts: string[]
}

interface keys {
    publickey: string, privatekey: string
}

export default function Dashboard() {
    const token = localStorage.getItem("tokenlaunchpadToken")
    const [dashboard, setDashBoard] = useState<Dashboard>({
        privatekey: "",
        publickey: "",
        solbalance: -1,
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
                solbalance: 0,
                ownedmintAccounts: dashboard.ownedmintAccounts
            }
            setDashBoard(data)
        }).catch((error)=> {
            alert("Error in Fetching details Re Login or wait for sometime")
            router.push("/")
        })
    }, [])

    useEffect(()=>{
        if(dashboard.publickey == "") return;
        const connections = new solana.Connection(Constants.RPC_URL, "confirmed")
        let wallet = new solana.PublicKey(dashboard.publickey)
        connections.getBalance(wallet).then((bal)=>{
            setDashBoard({
                publickey: dashboard.publickey,
                privatekey: dashboard.privatekey,
                solbalance: bal,
                ownedmintAccounts: dashboard.ownedmintAccounts
            })
        }).catch((er)=>{
            console.log(`error in fetching balance`)
            console.log(er)
        });
    },[dashboard.publickey, dashboard.ownedmintAccounts])

    const ownedAccounts = () =>{
        if(dashboard.ownedmintAccounts.length!=0) {
            return <>
            <h4>Owned Mint Accounts</h4>
            {dashboard.ownedmintAccounts.forEach((ownedAccountAddress, index, arr)=>{
                <Input id={index} props = {{placeholder: "Mint Account", value: ownedAccountAddress, onchange: ()=>{}, disable: true}}/>
            })}
            </>
        }
    }

    const generateMintAccount = (keys: keys) => {
        const connection = new solana.Connection(Constants.RPC_URL, "confirmed")
        const secretKey = base58.default.decode(dashboard.privatekey)
        const publicKey = new solana.PublicKey(dashboard.publickey)
        const payer = {
            publicKey: publicKey,
            secretKey: secretKey
        }
        alert(`want to create token ${dashboard.solbalance}`)
        const confOptions: solana.ConfirmOptions = {
            commitment: "finalized"
        }
        solanaToken.createMint(connection, payer, publicKey, publicKey, 9, undefined, confOptions).then((publicKey)=>{
            alert(`your new token mint account is ${publicKey.toBase58()}`)
            const newaccount = dashboard.ownedmintAccounts
            newaccount.push(publicKey.toBase58())
            setDashBoard({
                privatekey: dashboard.privatekey,
                publickey: dashboard.publickey,
                solbalance: dashboard.solbalance,
                ownedmintAccounts: newaccount,
            })
        }).catch((error)=>{
            console.log("error in creating token")
            console.log(error)
        })
    }

    async function fetchAllTokenAccounts(keys: keys) {
        const connection = new solana.Connection(Constants.RPC_URL)
        const pubKey = new solana.PublicKey(keys.publickey)
        const signature = await connection.getSignaturesForAddress(pubKey)
        // const transactionInfo: 
        for(let i=0; i<signature.length;++i){
            const signAtureInfo = await connection.getSignatureStatus
        }

    }
    

    return (<div className="dashBoardContainer">
    <>
        <h3>Sol Balance(Lamports)</h3>
        <Input props = {{placeholder: "", value: dashboard.solbalance, onchange: ()=>{}, disable: true}}/>
        <h3>Private Key</h3>
        <Password props = {{password: dashboard.privatekey, disable: true}}/>
        <h3>Public Key</h3>
        <Input props = {{placeholder: "Public Key", value: dashboard.publickey, onchange: ()=>{}, disable: true}}/>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <Button props={{onclick: ()=>{generateMintAccount({publickey: dashboard.publickey, privatekey: dashboard.privatekey})}, buttonname: "Generate Token" }}/>
            <Button props={{onclick: ()=>{fetchAllTokenAccounts({publickey: dashboard.publickey, privatekey: dashboard.privatekey})}, buttonname: "Fetch All Tokens" }}/>
        </div>
        {ownedAccounts()}
    </>
</div>)
}