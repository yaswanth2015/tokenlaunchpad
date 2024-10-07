import { JSXElementConstructor, useState } from "react"
import Button from "../CommonComponents/button"
import * as solanaToken from "@solana/spl-token"
import * as solana from "@solana/web3.js"
import { endianness } from "os"
import * as Constants from "../../Constants"
import "./MintAccount.css"


async function getSupply(mintAccount: String) {
    const connection = new solana.Connection(Constants.RPC_URL)
    const pubKey = new solana.PublicKey(mintAccount);
    
    const supply = await connection.getTokenSupply(pubKey);
    alert(`Total Supply of the token ${mintAccount} is ${supply.value.amount}`)
}

async function MintTo(sendTo: String, mintAccount: String, owner: solana.Signer) {
    const connection = new solana.Connection(Constants.RPC_URL)
    const mintAccountAddress = new solana.PublicKey(mintAccount);
    const signature = await solanaToken.mintTo(connection, owner, mintAccountAddress, owner.publicKey, owner, 10000000)
}

function ExpandSectionofMint(props: {mintAddres: String, owner: solana.Signer}) {

    return <div style={{display: "flex", justifyContent: "space-between"}}>
        <div><Button props={{onclick: ()=>{MintTo("", props.mintAddres, props.owner)}, buttonname: "Mint To" }}/></div>
        <div><Button props={{onclick: ()=>{getSupply(props.mintAddres)}, buttonname: "Get Supply" }}/></div>
    </div>
    
}




export default function MintAccountDetails(props: {mintAccount: string, owner: solana.Signer}) {
    const [isExpanded, setExpand] = useState(false)

    return <>
        <div className = "mintContainer">
            <div style={{display: "flex", justifyContent: "space-between"}}> 
                <div> {props.mintAccount} </div>
                <div> <button onClick={()=>{setExpand(!isExpanded)}} style={{width: "30px", fontSize: "25px"}}>{isExpanded ? "-" : "+"}</button> </div>
            </div>
            {
                isExpanded && <ExpandSectionofMint mintAddres={props.mintAccount} owner={props.owner}/>
            }
        </div>
    </>
}