import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface FormSuccessProps {
  message?: string;
  onClose: () => void;
}

export const FormSuccess = ({ message, onClose }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 rounded-md p-3 flex items-center gap-2 text-sm font-medium text-emerald-500">
      <FaCheckCircle />
      {message}
      <div
        onClick={onClose}
        className="ml-auto text-emerald-500 cursor-pointer"
      >
        <IoClose />
      </div>
    </div>
  );
};
