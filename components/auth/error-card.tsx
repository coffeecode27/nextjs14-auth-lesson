import { CardWrapper } from "./card-wrapper";
import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="opps something went wrong!"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <FaExclamationTriangle className="w-full h-8 text-red-500 flex justify-center items-center" />
    </CardWrapper>
  );
};
