import LikeImage from "../../public/like.svg";
import HomeImage from "../../public/home.svg";
import SearchImage from "../../public/search.svg";

const Header = () => {
  return (
    <div className="flex justify-between pt-12 mb-12">
      <span>NFT-Gramm</span>
      <span className="flex gap-x-10">
        <LikeImage />
        <HomeImage />
        <SearchImage />
      </span>
      <span>123</span>
    </div>
  );
};

export default Header;
