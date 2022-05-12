import Image from "next/image";
import cat from "../public/cat.jpeg";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { nftGramm, subContract } from "../config";
import NFTGramm from "../artifacts/contracts/NFT-Gramm.sol/NFTGramm.json";
import SubContract from "../artifacts/contracts/SubContract.sol/SubContract.json";

const Profile = () => {
  const [nfts, setNfts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [subsOpen, setSubsOpen] = useState(false);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mumbai",
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

    const address = router.query?.address
      ? router.query?.address
      : await signer.getAddress();
    const data = await marketplaceContract.fetchMyNFTs(address);
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

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mumbai",
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

    const address = router.query?.address
      ? router.query?.address
      : await signer.getAddress();
    const data = await marketplaceContract.fetchMyNFTs(address);
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

  async function loadSubscribes() {
    const web3Modal = new Web3Modal({
      network: "mumbai",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketplaceContract = new ethers.Contract(
      subContract,
      SubContract.abi,
      signer
    );

    const data = await marketplaceContract.fetchMySubs();

    setFollowers(data[1]);
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
  }

  async function subscribe() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(subContract, SubContract.abi, signer);
    const address = router.query?.address && router.query?.address;
    let transaction = await contract.subscribe(address);
    await transaction.wait();
  }

  function loader({ src, width, quality }) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  useEffect(() => {
    loadNFTs();
    loadSubscribes();
  }, []);

  return (
    <div className="flex">
      <div className="flex flex-col mr-12 w-80">
        <div className="flex justify-center px-14 mb-5">
          <Image
            loader={loader}
            className="rounded-full"
            width={120}
            height={120}
            src={cat}
          />
        </div>
        <div className="flex justify-around w-80">
          <span
            onClick={() => setSubsOpen(!subsOpen)}
            className="text-center cursor-pointer"
          >
            <div className="text-lg">
              {followers.length && followers.length}
            </div>
            <div>Followers</div>
          </span>
          <span className="text-center">
            <div className="text-lg">{nfts.length && nfts.length}</div>
            <div>NFT`s</div>
          </span>
        </div>
        {router.query.address && (
          <button
            onClick={() => subscribe()}
            className="border rounded-sm py-2 mt-6"
          >
            Follow
          </button>
        )}
        {subsOpen && followers.length ? (
          <div className="mt-8 max-w-18">
            <div className="pb-4 text-lg">All Followers:</div>
            <div className="flex flex-col gap-1 cursor-pointer">
              {followers.map((f) => (
                <span
                  onClick={() => {
                    router.push({
                      pathname: "/profile",
                      query: { address: f },
                    });
                  }}
                  className="text-ellipsis overflow-hidden"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex ">
        {loadingState === "loaded" && nfts.length ? (
          <div className="grid grid-cols-3 gap-7 flex-wrap">
            {nfts.map(
              (nft, i) =>
                nft?.image && (
                  <span className="flex flex-col" key={i}>
                    <Image
                      loader={loader}
                      src={nft?.image}
                      width={300}
                      height={300}
                    />
                    <button onClick={() => addLike(nft?.tokenId)}>Like</button>
                  </span>
                )
            )}
          </div>
        ) : (
          <h1 className="py-10 px-20 text-3xl">No NFTs owned </h1>
        )}
      </div>
    </div>
  );
};

export default Profile;
