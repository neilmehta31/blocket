import { useState, useEffect } from "react"
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, Connection, clusterApiUrl } from "@solana/web3.js";
import nacl from "tweetnacl"

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);
    const [solBalances, setSolBalances] = useState({});
    
    const solanaConnection = new Connection(clusterApiUrl("devnet"));

    useEffect(() => {
        async function fetchBalances() {
          for (const key of publicKeys) {
            const solBalance = await solanaConnection.getBalance(key);
            setSolBalances((prev) => ({ ...prev, [key.toBase58()]: solBalance / 1e9 }));
          }
        }

        fetchBalances();
        
      }, [publicKeys]);
    
    if(mnemonic==null){
        return(
            <div >
                <p>
                    Generate a mnemonic first!
                </p>
            </div>
        );
    } else{
    return (
      <div>
        <h2>Solana Wallet</h2>
        <p>Mnemonic: {mnemonic}</p>
        <button
          onClick={async function () {
            const seed = await mnemonicToSeed(mnemonic);
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            setCurrentIndex(currentIndex + 1);
            setPublicKeys([...publicKeys, keypair.publicKey]);
          }}
        >
          Add Solana wallet
        </button>
        {publicKeys.map((p) => (
          <div>{p.toBase58()} balance: {solBalances[p]}</div>
        ))}
      </div>
    );}
}