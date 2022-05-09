import { Modal } from "@mantine/core";
import Dropzone from "../Dropzone";

const CreateItemModal = ({ isShowing, hide }) => (
  <Modal opened={isShowing} onClose={hide}>
    <Dropzone />
  </Modal>
);

export default CreateItemModal;
