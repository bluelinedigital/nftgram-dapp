import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import cat from "../public/cat.jpeg";
import LikeImage from "../public/like.svg";

import { nftGramm } from "../config";

import NFTGramm from "../artifacts/contracts/NFT-Gramm.sol/NFTGramm.json";
import Image from "next/image";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  // useEffect(() => {
  //   loadNFTs();
  // }, []);

  const mock = [
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
    {
      image:
        "https://bafybeiakwr57wcvrj5jmj2ljp5ed25iwnwnaucvks2z4mcog27qmh2qtfq.ipfs.infura-ipfs.io/",
    },
  ];

  function loader({ src, width, quality }) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

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
  // return (
  //   <div>
  //     <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
  //     <ul>
  //       <li>
  //         <Link href="/profile">
  //           <a>Your profile</a>
  //         </Link>
  //       </li>
  //       <li>
  //         <Link href="/create-item">
  //           <a>Create nft</a>
  //         </Link>
  //       </li>
  //     </ul>
  //   </div>
  // );
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="shadow overflow-hidden">
              <Image
                loader={loader}
                src={nft?.image}
                width={600}
                height={600}
              />
              <div className="flex justify-between px-6 py-3">
                <span className="flex items-center">
                  <Image
                    loader={loader}
                    className="rounded-full cursor-pointer"
                    width={34}
                    height={34}
                    src={cat}
                  />
                  <span className="pl-6">Bored Ape Yacht Club</span>
                </span>
                <span className="flex gap-4">
                  <span>100 likes</span>
                  <LikeImage />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
