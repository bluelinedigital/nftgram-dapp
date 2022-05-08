import Image from "next/image";
import cat from "../public/cat.jpeg";

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";

import { nftGramm } from "../config";

import NFTGramm from "../artifacts/contracts/NFT-Gramm.sol/NFTGramm.json";
import Link from "next/link";
import Header from "../components/Header";

export default function Profile() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketplaceContract = new ethers.Contract(
      nftGramm,
      NFTGramm.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let item = {
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function addLike(like) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftGramm, NFTGramm.abi, signer);
    let transaction = await contract.addLike(like);
    await transaction.wait();

    router.push("/profile");
  }

  function loader({ src, width, quality }) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <div>
        <h1 className="py-10 px-20 text-3xl">No NFTs owned </h1>
        <Link href="/create-item">
          <a>Create nft</a>
        </Link>
      </div>
    );
  return (
    <div className="sm:container max-w-5xl">
      <Header />
      <div className="flex">
        <div className="flex flex-col flex-1">
          <div className="flex justify-center">
            <Image
              loader={loader}
              className="rounded-full"
              width={150}
              height={150}
              src={cat}
            />
          </div>
          <button className="border rounded-sm py-2">Follow</button>
        </div>
        <div className="flex flex-5">
          <div className="grid grid-cols-3 gap-7">
            {nfts.map(
              (nft, i) =>
                nft?.image && (
                  <span className="flex flex-col" key={i}>
                    <Image
                      loader={loader}
                      src={nft?.image}
                      width={350}
                      height={350}
                    />
                    <button onClick={() => addLike(nft?.tokenId)}>Like</button>
                  </span>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
