import React from "react";
interface Props {
  message: string;

  description: string;
}
const ToastMessage: React.FC<Props> = ({ message, description }) => {
  return (
    <div>
      <h4 className="font-bold text-lg">{message}</h4>

      <p className="p-medium-14">{description}</p>
    </div>
  );
};

export default ToastMessage;
