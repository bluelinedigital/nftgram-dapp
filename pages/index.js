import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import cat from "../public/cat.jpeg";
import LikeImage from "../public/like1.svg";
import LikedImage from "../public/like2.svg";
import Image from "next/image";
import { nftGramm } from "../config";
import NFTGramm from "../artifacts/contracts/NFT-Gramm.sol/NFTGramm.json";
import { useRouter } from "next/router";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [address, setAddress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getAddress();
    loadNFTs();
  }, []);

  function loader({ src, width, quality }) {
    return `${src}?w=${width}&q=${quality || 75}`;
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

  async function getAddress() {
    const web3Modal = new Web3Modal({
      network: "mumbai",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const address = router.query?.address
      ? router.query?.address
      : await signer.getAddress();

    setAddress(address);
  }

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.infura.io/v3/c4b43a0d4c23428f91737196af1489cf"
    );
    const contract = new ethers.Contract(nftGramm, NFTGramm.abi, provider);
    const data = await contract.fetchAllNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let item = {
          tokenId: i.tokenId.toNumber(),
          owner: i.owner,
          likes: i.likes,
          image: meta.data.image,
        };
        return item;
      })
    );
    console.log(items);
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
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
              <div className="flex justify-between px-6 py-3 items-center">
                <span className="flex items-center">
                  <Image
                    onClick={() => {
                      router.push({
                        pathname: "/profile",
                        query: { address: nft?.owner },
                      });
                    }}
                    loader={loader}
                    className="rounded-full cursor-pointer"
                    width={34}
                    height={34}
                    src={cat}
                  />
                  <span className="pl-6 text-ellipsis overflow-hidden">
                    {nft?.owner}
                  </span>
                </span>
                <span className="flex gap-4">
                  <span className="whitespace-nowrap">
                    {nft.likes?.length} likes
                  </span>
                  <button onClick={() => addLike(nft?.tokenId)}>
                    {nft?.likes.find((e) => e === address && true) ? (
                      <LikedImage />
                    ) : (
                      <LikeImage />
                    )}
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
