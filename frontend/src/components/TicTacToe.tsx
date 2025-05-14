import { useEffect, useState } from "react";
import { api } from "../services/api";
import Modal from './Modal';
import "./TicTacToe.css";

const Player = {
  'None': 0,
  'X': 1,
  'O': 2,
}

const PlayerMark = {
  0: ' ',
  1: 'X',
  2: 'O'
}

type ForfeitProps = {
  enabled: boolean;
  onForfeit: () => void;
};

const Forfeit: React.FC<ForfeitProps> = ({ enabled, onForfeit }) => {
  return (
    <div className={`flex items-center transition-opacity duration-300 ${enabled ? 'opacity-100' : 'opacity-0'}`}>
      <button disabled={!enabled} onClick={onForfeit}>Forfeit?</button>
    </div>
  )
}

export default function Board() {
  const [win, setWin] = useState<boolean>(false);
  const [draw, setDraw] = useState<boolean>(false);
  const [forfeit, setForfeit] = useState<typeof Player.X |typeof Player.O>(Player.None);
  const [forfeiting, setForfeiting] = useState<boolean>(false);
  const [player, setPlayer] = useState<typeof Player.X |typeof Player.O>(Player.X);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    api
      .get("/game")
      .then((res) => setBoard(res.data))
      .catch((err) => console.error(err));
  }, [player, win, draw]);

  const makePlay = (index: number) => () => {
    api
      .put(`/game/${player}/${index}`)
      .then((res) => {
        const { isWin, isDraw } = res.data;
        setWin(isWin);
        setDraw(isDraw);

        if (!isWin && !isDraw) {
          setPlayer(player === Player.X ? Player.O : Player.X);
        }
      })
      .catch((err) => console.error(err));
  };

  const newGame = () => {
    api
      .delete('/game')
      .then(() => api.get('/game'))
      .then((res) => setBoard(res.data))
      .then(() => {
        setPlayer(Player.X);
        setWin(false);
        setDraw(false);
        setForfeit(Player.None);
      })
      .catch((err) => console.error(err));
  };

  const forfeitGame = () => {
    setForfeiting(false);
    setForfeit(player);
  }

  const getGameOverTitle = () => {
    if (win) {
      return `Player ${PlayerMark[player as keyof typeof PlayerMark]} won!`;
    } else if (forfeit) {
      return `Player ${PlayerMark[player as keyof typeof PlayerMark]} forfeits`;
    }

    return 'Draw';
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center">
          <div style={{padding: '16px'}}>
            <div style={{margin: '8px', padding: '16px'}} className={`cursor-default text-9xl m-8 relative after:bg-black after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 ${player === Player.X ? 'after:w-full' : 'after:w-0'}`}>
              X
            </div>
            <Forfeit enabled={player === Player.X} onForfeit={() => setForfeiting(true)}/>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell: number, index: number) => {
              const gameover: boolean = win || draw;
              const clicker =
                cell === 0 && !gameover ? makePlay(index) : () => null;
              return (
                <div
                  className="w-30 h-30 text-8xl font-semibold text-center content-center text-white bg-blue-500 hover:bg-blue-600 rounded shadow"
                  onClick={clicker}
                >
                  {PlayerMark[cell as keyof typeof PlayerMark]}
                </div>
              );
            })}
          </div>
          <div style={{padding: '16px'}}>
            <div style={{margin: '8px', padding: '16px'}} className={`cursor-default text-9xl m-8 relative after:bg-black after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 ${player === Player.O ? 'after:w-full' : 'after:w-0'}`}>
              O
            </div>
            <Forfeit enabled={player === Player.O} onForfeit={() => setForfeiting(true)}/>
          </div>
        </div>
      </div>
        <Modal isOpen={win || draw || forfeit != Player.None} title={getGameOverTitle()}>
            <button
            onClick={newGame}
          >
            Try Again?
          </button>
        </Modal>
        <Modal isOpen={forfeiting} title="Are you sure?">
          <div>
            <button
              onClick={forfeitGame}
            >
              Yes
            </button>
            <button
              onClick={() => setForfeiting(false)}
            >
              No
            </button>
          </div>
        </Modal>
    </>
  );
}
