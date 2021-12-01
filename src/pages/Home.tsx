import { useNavigate } from "react-router-dom";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

import Button from "../components/Button";
import "../styles/css/auth.css";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";

function Home() {
  const [roomCode, setRoomCode] = useState("");
  const navigation = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    navigation("/rooms/new");
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room does not exists");
      return;
    }

    navigation(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form className="form" onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Home;
