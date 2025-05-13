import { useEffect, useState } from "react";
import { api } from "../services/api";

const Player = {
    0: ' ',
    1: 'X',
    2: 'O'
}

const Win = {
    0: '',
    1: 'Win',
    2: 'Tie',
}

export default function Board() {
    const [win, setWin] = useState<boolean>(false);
    const [draw, setDraw] = useState<boolean>(false);
    const [player, setPlayer] = useState<number>(1);
    const [board, setBoard] = useState([]);

    useEffect(() => {
        api.get('/game')
        .then((res) => setBoard(res.data))
        .catch((err) => console.error(err))
    }, [player, win, draw])

    const makePlay = (index: number) => () => {
        api.put(`/game/${player}/${index}`)
        .then((res) => {
            const { isWin, isDraw } = res.data;
            setWin(isWin);
            setDraw(isDraw);
            
            if (!isWin && !isDraw) {
                setPlayer(player === 1 ? 2 : 1);
            }
        })
        .catch((err) => console.error(err))
    }

    const reset = () => {
        api.delete('/game')
        .then(() => {
            setPlayer(1);
            setWin(false);
            setDraw(false);
        })
        .catch((err) => console.error(err))
    }

    return (
        <div className="flex flex-col items-center">
            <div className="text-2xl">
                {
                    draw && 'Draw!!!!!'
                }
                {
                    !draw && <div className="font-bold">{Player[player as keyof typeof Player]}{win ? ' WINS!!!!' : ''}</div>
                }
            </div>
            <div className="flex flex-wrap" style={{ width: '350px' }}>
            {
                board.map((cell: number, index: number) => {
                    const gameover: boolean = win || draw;
                    const cursortype: string = cell === 0 && !gameover ?  'cursor-pointer' : 'cursor-no-drop';
                    const clicker = cell === 0 && !gameover ? makePlay(index) : () => null;
                    return (
                        <div className={`m-6 px-6 py-6 border-1 border-solid ${cursortype} min-w-16 min-h-18`} onClick={clicker}>
                            {Player[cell as keyof typeof Player]}
                        </div>
                    )
                })
            }
            </div>
            <div className="flex items-center">
                <button onClick={reset}>Reset</button>
            </div>
        </div>
    )
}