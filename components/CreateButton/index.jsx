import Plus from "../../public/plus.svg";

const CreateButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="fixed bottom-20 right-20">
      <Plus />
    </button>
  );
};

export default CreateButton;
