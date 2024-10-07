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
import * as nacl from "tweetnacl"
import MintAccountDetails from "../MintAccountDetails/MintAccount"

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
        //console.log(dashboard.ownedmintAccounts)
        const items = dashboard.ownedmintAccounts.map((value)=>{
            return <li><MintAccountDetails mintAccount={value} owner={{secretKey: base58.default.decode(dashboard.privatekey), publicKey: new solana.PublicKey(dashboard.publickey)}}/></li>
        })
        //console.log(items)
        if(dashboard.ownedmintAccounts.length!==0) {
            return <>
                <h1>Owned Mint Accounts</h1>
                <br />
                <ul>
                {items}
                </ul>
            </>
        }
    }

    const generateMintAccount = async (keys: keys) => {
        //STEPS FOR Creating MINT Account
        //1. Create System program
        //2. Write Instructions for making the account as mint account
        //3. sign the message
        const ownerKeys = solana.Keypair.fromSecretKey(base58.default.decode(keys.privatekey))
        const connection = new solana.Connection(Constants.RPC_URL)
        const rentExcemptionLamports = await solanaToken.getMinimumBalanceForRentExemptMint(connection)
        const latestBlockHash = await connection.getLatestBlockhash('confirmed')
        const newkeyPairForMintAccount = solana.Keypair.generate()
        const blockHash: solana.TransactionBlockhashCtor = {
            feePayer: ownerKeys.publicKey,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
        }
        const transaction = new solana.Transaction(blockHash)

        transaction.add(
            solana.SystemProgram.createAccount({
                fromPubkey: ownerKeys.publicKey,
                newAccountPubkey: newkeyPairForMintAccount.publicKey,
                space: solanaToken.MINT_SIZE,
                lamports: rentExcemptionLamports,
                programId: solanaToken.TOKEN_PROGRAM_ID
            }),
            solanaToken.createInitializeMint2Instruction(
                newkeyPairForMintAccount.publicKey, 
                2, 
                ownerKeys.publicKey,
                ownerKeys.publicKey,
                solanaToken.TOKEN_PROGRAM_ID,
            )
        )

        const transactionBufferMessage = transaction.serializeMessage()
        const messageSignature = nacl.sign.detached(transactionBufferMessage, ownerKeys.secretKey)
        transaction.addSignature(ownerKeys.publicKey, Buffer.from(messageSignature))
        let isSignatureVerified = transaction.verifySignatures()
        
        const transactionSignature = await solana.sendAndConfirmTransaction(connection, transaction, [ownerKeys, newkeyPairForMintAccount])
        console.log(transactionSignature)
        //MARK: Above code is for sending raw transaction
        //MARK: Below code is for inbuilt functions
        // const connection = new solana.Connection(Constants.RPC_URL, "confirmed")
        // const secretKey = base58.default.decode(dashboard.privatekey)
        // const publicKey = new solana.PublicKey(dashboard.publickey)
        // const payer = {
        //     publicKey: publicKey,
        //     secretKey: secretKey
        // }
        // const confOptions: solana.ConfirmOptions = {
        //     commitment: 'confirmed'
        // }
        // solanaToken.createMint(connection, payer, publicKey, publicKey, 9, undefined, confOptions).then((publicKey)=>{
        //     alert(`your new token mint account is ${publicKey.toBase58()}`)
        //     const newaccount = dashboard.ownedmintAccounts
        //     newaccount.push(publicKey.toBase58())
        //     setDashBoard({
        //         privatekey: dashboard.privatekey,
        //         publickey: dashboard.publickey,
        //         solbalance: dashboard.solbalance,
        //         ownedmintAccounts: newaccount,
        //     })
        // }).catch((error)=>{
        //     console.log("error in creating token")
        //     console.log(error)
        // })
    }

    async function fetchAllTokenAccounts(keys: keys) {
        const connection = new solana.Connection(Constants.RPC_URL)
        const ownerKeys = solana.Keypair.fromSecretKey(base58.default.decode(keys.privatekey)); 
        const signatures = await connection.getSignaturesForAddress(ownerKeys.publicKey)
        const ownedmintAccounts: string[] = []
        for(const signatureOfTxn of signatures) {
            const info = await connection.getTransaction(signatureOfTxn.signature)
            if (info !== null && info.meta?.logMessages?.find((value)=>{ return value===Constants.tokeMINTInit }) !== undefined && info.meta?.logMessages?.find((value)=>{ return value===Constants.tokenProgramSuccessMessageLogMessage }) !== undefined ) {
                for(let accountkey of info?.transaction.message.accountKeys){
                    if (accountkey.toBase58() !==  ownerKeys.publicKey.toBase58() && accountkey.toBase58() !== solanaToken.TOKEN_PROGRAM_ID.toBase58() && accountkey.toBase58() !== solana.SystemProgram.programId.toBase58()) {
                        ownedmintAccounts.push(accountkey.toBase58())
                    }
                }
            }
        }
        //console.log(ownedmintAccounts)
        setDashBoard({
            privatekey: dashboard.privatekey,
            publickey: dashboard.publickey,
            solbalance: dashboard.solbalance,
            ownedmintAccounts: ownedmintAccounts
        })
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