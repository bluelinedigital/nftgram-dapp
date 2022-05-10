import { Modal } from "@mantine/core";
import DropzoneField from "../DropzoneField";

const CreateItemModal = ({ isShowing, hide }) => (
  <Modal opened={isShowing} onClose={hide}>
    <DropzoneField />
  </Modal>
);

export default CreateItemModal;
