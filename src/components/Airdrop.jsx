import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { ShowSolBalance } from "./ShowBalance";
import { SendTokens } from "./SendSol";
import { amountToUiAmount, createMint } from "@solana/spl-token";


// The useWallet `hook` provides the wallet variable inside the 
// airdrop component because I wrapped the Airdrop componenet
// inside the WalletProvider
export function Airdrop(){
    // Hooks in react
    const wallet = useWallet();
    const { connection } = useConnection();

    async function sendAirdropToUser() {
        const amount = document.getElementById("publicKey").value
        await connection.requestAirdrop(
          wallet.publicKey,
          amount * LAMPORTS_PER_SOL
        );
        alert("Airdropped " + amount + " sol");
    }

    return <div>
        {/* Hi account holder : {wallet.publicKey.toString()} */}
        <input id="publicKey" type="text" placeholder="Amount"></input>
        <button onClick={sendAirdropToUser}>Send Airdrop</button>
        <ShowSolBalance />
        <SendTokens />
    </div>
}

export function SolTransaction() {
    const wallet =useWallet();

    const { connection }=useConnection();
    async function doTransaction(){
        try{
            console.log('Hello doTransaction');

            let to = document.getElementById("to").value;
            let amount = document.getElementById("amount").value;
            const transact = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(to),
                    lamports: amount * LAMPORTS_PER_SOL
                }) 
            )
            const sign = await wallet.sendTransaction(transact, connection);
            alert(`Sent ${amount} SOL to ${to}`);

        } catch(err){
            console.log('transaction falied');
        }
    }

    return (<div>
        <input type="text" placeholder="To" id="to" />
        <input type="text" placeholder="Amount" id="amount" />
        <button onClick={()=>doTransaction()}>Send</button>
        </div>)
}