import { useState } from 'react'
import './App.css'
import { generateMnemonic } from "bip39";
import { SolanaWallet } from './components/SolanaWallet';
import { EthWallet } from './components/EthWallet';

function App() {
  const [count, setCount] = useState(0);
  const [mnemonic, setMnemonic] = useState("");

  async function generateAndCopyMnemonic() {
    const mn = await generateMnemonic();
    setMnemonic(mn);
    copyToClipboard(mn);
  }
  

  function copyToClipboard(mn) {
    navigator.clipboard.writeText(mn);
  }

  return (
    <>
      <button
        onClick={generateAndCopyMnemonic}
      >
        Create Seed Phrase and copy to clipboard
      </button>
      <input type="text" value={mnemonic}></input>
      <div className="wallets-container">
        <SolanaWallet mnemonic={mnemonic==""? null :mnemonic}/>
        <EthWallet mnemonic={mnemonic==""? null :mnemonic}/>
      </div>
    </>
  );
}     

export default App
