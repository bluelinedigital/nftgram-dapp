import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import Link from "next/link";

import { nftGramm } from "../config";

import NFTGramm from "../artifacts/contracts/NFT-Gramm.sol/NFTGramm.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  // useEffect(() => {
  //   loadNFTs();
  // }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(nftGramm, NFTGramm.abi, provider);
    const data = await contract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let item = {
          tokenId: i.tokenId.toNumber(),
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  // if (loadingState === "loaded" && !nfts.length)
  return (
    <div>
      <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
      <ul>
        <li>
          <Link href="/profile">
            <a>Your profile</a>
          </Link>
        </li>
        <li>
          <Link href="/create-item">
            <a>Create nft</a>
          </Link>
        </li>
      </ul>
    </div>
  );
  // return (
  //   <div className="flex justify-center">
  //     <div className="px-4" style={{ maxWidth: "1600px" }}>
  //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
  //         {nfts.map((nft, i) => (
  //           <div key={i} className="border shadow rounded-xl overflow-hidden">
  //             <img src={nft.image} />
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
}
