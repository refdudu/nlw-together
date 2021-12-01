import { ReactNode } from "react";
import copyImg from "../assets/images/copy.svg";

import "../styles/css/room-code.css";

interface RoomCodeProps {
  children?: ReactNode;
  code: string;
}

function RoomCode({ children, code }: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copiar código da sala" />
      </div>
      <span>Sala #{code}</span>
    </button>
  );
}

export default RoomCode;
