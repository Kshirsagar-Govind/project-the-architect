import { ImSpinner2 } from "react-icons/im";

export const ButtonSpinner = ({text}:{text:string}) => (
    <div className="flex align-middle items-center">

     { text.length>0 && <p className="mr-2" >{text}</p>}
  <ImSpinner2 className="animate-spin text-white text-lg" />
    </div>
);


