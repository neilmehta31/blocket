import { useEffect, useState } from "react"
import { Wallet, HDNodeWallet, AlchemyProvider } from "ethers";
import { mnemonicToSeed } from "bip39";

export const EthWallet = ({mnemonic}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [ethBalances, setEthBalances] = useState({});
    
    const ethersProvider = new AlchemyProvider("sepolia", import.meta.env.VITE_ALCHEMY_API_KEY);

    useEffect(() =>{
      async function fetchBalances() {
      const balances = await Promise.all(
        addresses.map(async (address) => {
          const balance = await ethersProvider.getBalance(address);
          return { address, balance: balance.toString() };
        })
      );

      const balanceMap = balances.reduce((acc, { address, balance }) => {
        acc[address] = balance / 1e18; // Convert from wei to ether
        return acc;
      }, {});

      setEthBalances(prev => ({ ...prev, ...balanceMap }));
      }
      fetchBalances();
    },[addresses]);

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
          <h2>Ethereum Wallet</h2>
          <p>Mnemonic: {mnemonic}</p>
          <button
            onClick={async function () {
              const seed = await mnemonicToSeed(mnemonic);
              const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
              const hdNode = HDNodeWallet.fromSeed(seed);
              const child = hdNode.derivePath(derivationPath);
              const privateKey = child.privateKey;
              const wallet = new Wallet(privateKey);
              setCurrentIndex(currentIndex + 1);
              setAddresses([...addresses, wallet.address]);
            }}
          >
            Add ETH wallet
          </button>

          {addresses.map((p) => (
            <div>Eth - {p} - balance: {ethBalances[p]}</div>
          ))}
        </div>
      );
    }
}