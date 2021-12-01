import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router";
import logoImg from "../assets/images/logo.svg";
import Button from "../components/Button";
import RoomCode from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import "../styles/css/rooms.css";

type RoomParams = {
  id: string;
};

type FireBaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;
type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

function Room() {
  const { id: roomId } = useParams() as RoomParams;
  const { user } = useAuth();

  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    console.log(roomId);

    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.once("value", (room) => {
      const databaseRoom = room.val();

      const firebaseQuestions: FireBaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
          };
        }
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () => {};
  }, [roomId]);

  async function handleSendQuestion(e: FormEvent) {
    e.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }
    if (!user) {
      throw new Error("You must be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);
    setNewQuestion("");
  }
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta (s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          {user && (
            <textarea
              placeholder="O que você quer perguntar?"
              onChange={(e) => setNewQuestion(e.target.value)}
              value={newQuestion}
            />
          )}
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            {user && <Button type="submit">Enviar pergunta</Button>}
          </div>
        </form>
      </main>
    </div>
  );
}

export default Room;
