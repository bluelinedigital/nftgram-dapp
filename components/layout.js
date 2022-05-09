import { useState } from "react";
import CreateButton from "./CreateButton";
import Header from "./Header";
import CreateItemModal from "./modals/CreateItemModal";

export default function Layout({ children }) {
  const [isShowing, setShowing] = useState(false);

  const toggleModal = () => {
    setShowing(!isShowing);
  };
  return (
    <div className="lg:container lg:mx-auto relative">
      <Header openModal={toggleModal} />
      <main>{children}</main>
      <CreateItemModal isShowing={isShowing} hide={toggleModal} />
      <CreateButton onClick={toggleModal} />
    </div>
  );
}
