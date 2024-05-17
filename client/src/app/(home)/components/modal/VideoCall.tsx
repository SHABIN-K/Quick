import Modal from "@/components/Modal";

interface AddMemberModalProps {
  isOpen?: boolean;
  onClose: () => void;
}
const VideoCall: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={true} onClose={false}>
      VideoCall
    </Modal>
  );
};

export default VideoCall;
