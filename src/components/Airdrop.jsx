import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js";


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
    </div>
}