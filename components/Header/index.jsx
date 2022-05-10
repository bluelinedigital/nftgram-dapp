import LikeImage from "../../public/like.svg";
import HomeImage from "../../public/home.svg";
import SearchImage from "../../public/search.svg";
import cat from "../../public/cat.jpeg";
import Link from "next/link";
import Image from "next/image";

const navButtons = [
  { src: LikeImage, url: "/" },
  { src: HomeImage, url: "/" },
  { src: HomeImage, url: "/" },
];

const Header = ({ openModal }) => {
  function loader({ src, width, quality }) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  return (
    <div className="flex justify-between pt-12 mb-12 px-20">
      <span className="text-xl -mr-16">NFT-Gramm</span>
      <span className="flex gap-x-10 items-center">
        <Link href={"/"}>
          <HomeImage className="cursor-pointer" />
        </Link>
        <LikeImage className="cursor-pointer" />
        <SearchImage className="cursor-pointer" />
      </span>
      <Link href={"/profile"}>
        <Image
          loader={loader}
          className="rounded-full cursor-pointer"
          width={34}
          height={34}
          src={cat}
        />
      </Link>
    </div>
  );
};

export default Header;
