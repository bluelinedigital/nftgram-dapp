import { Modal } from "@mantine/core";
import DropzoneField from "../DropzoneField";

const CreateItemModal = ({ isShowing, hide }) => (
  <Modal opened={isShowing} onClose={hide}>
    <DropzoneField modalClose={hide} />
  </Modal>
);

export default CreateItemModal;
