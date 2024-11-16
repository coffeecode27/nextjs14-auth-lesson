import { FaExclamationTriangle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// interface untuk props form error
interface FormErrorProps {
  message?: string;
  onClose: () => void;
}

export const FormError = ({ message, onClose }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div className="bg-red-500/10 rounded-md p-3 flex items-center gap-2 text-sm font-medium text-red-500">
      <FaExclamationTriangle />
      {message}
      <button onClick={onClose} className="ml-auto text-red-500">
        <IoClose />
      </button>
    </div>
  );
};
