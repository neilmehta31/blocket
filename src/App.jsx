import { generateMnemonic } from "bip39";
import { React, useState } from 'react';
import './App.css';
import { EthWallet } from './components/EthWallet';
import { SolanaWallet } from './components/SolanaWallet';
import { Airdrop } from "./components/Airdrop";
import { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const [mnemonic, setMnemonic] = useState("");

  async function generateAndCopyMnemonic() {
    const mn = await generateMnemonic();
    setMnemonic(mn);
    copyToClipboard(mn);
  }
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => "https://solana-devnet.g.alchemy.com/v2/i0fTqVfPsdkRCRa7g4-rEGocK9ZK0mKD", [network]);


  const wallets = useMemo(
    () => [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  function copyToClipboard(mn) {
    navigator.clipboard.writeText(mn);
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <button onClick={generateAndCopyMnemonic}>
            Create Seed Phrase and copy to clipboard
          </button>
          <input type="text" value={mnemonic}></input>
          <div className="wallets-container">
            <SolanaWallet mnemonic={mnemonic == "" ? null : mnemonic} />
            <EthWallet mnemonic={mnemonic == "" ? null : mnemonic} />
          </div>
          <WalletMultiButton></WalletMultiButton>
          <WalletDisconnectButton></WalletDisconnectButton>
          <Airdrop></Airdrop>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}     

export default App
