import { useRouter } from "next/router";
import Plus from "../../public/plus.svg";

const CreateButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/create-item")}
      className="fixed bottom-20 right-20"
    >
      <Plus />
    </button>
  );
};

export default CreateButton;
