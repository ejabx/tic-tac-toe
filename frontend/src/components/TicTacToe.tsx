import { useEffect, useState } from 'react'
import { api } from '../services/api'
import Modal from './Modal'
import './TicTacToe.css'

const Player = {
    None: 0,
    X: 1,
    O: 2,
}

const PlayerMark = {
    0: ' ',
    1: 'X',
    2: 'O',
}

export default function Board() {
    const [player, setPlayer] = useState<typeof Player.X | typeof Player.O>(
        Player.X
    )
    const [board, setBoard] = useState(Array(9).fill(Player.None))
    const [win, setWin] = useState<boolean>(false)
    const [draw, setDraw] = useState<boolean>(false)
    const [quit, setQuit] = useState<typeof Player.X | typeof Player.O>(
        Player.None
    )
    const [quitting, setQuitting] = useState<boolean>(false)
    const [networkError, setNetworkError] = useState<boolean>(false)

    useEffect(() => {
        api.get('/game')
            .then((res) => setBoard(res.data))
            .catch((err) => {
                console.error(err)
                setNetworkError(true)
            })
    }, [player, win, draw, networkError])

    const makePlay = (index: number) => () => {
        api.put(`/game/${player}/${index}`)
            .then((res) => {
                const { isWin, isDraw } = res.data
                setWin(isWin)
                setDraw(isDraw)

                if (!isWin && !isDraw) {
                    setPlayer(player === Player.X ? Player.O : Player.X)
                }
            })
            .catch((err) => {
                console.error(err)
                setNetworkError(true)
            })
    }

    const newGame = () => {
        api.delete('/game')
            .then(() => api.get('/game'))
            .then((res) => setBoard(res.data))
            .then(() => {
                setPlayer(Player.X)
                setWin(false)
                setDraw(false)
                setQuit(Player.None)
            })
            .catch((err) => {
                console.error(err)
                setNetworkError(true)
            })
    }

    const quitGame = () => {
        setQuitting(false)
        setQuit(player)
    }

    const testNetworkConnection = () => {
        setNetworkError(false)
        api.get('/game').catch((err) => {
            console.error(err)
            setNetworkError(true)
        })
    }

    const getGameOverTitle = () => {
        if (win || quit) {
            return (
                <span>
                    Player&nbsp;
                    <span className="fixed font-sans text-4xl animate-bounce text-blue-300">
                        {PlayerMark[player as keyof typeof PlayerMark]}
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {win ? 'wins' : 'resigns'}!
                </span>
            )
        }

        return 'Draw'
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="text-6xl m-10">Tic Tac Toe</div>
                <div className="flex flex-row items-center">
                    <div style={{ padding: '16px' }}>
                        <div
                            style={{ margin: '8px', padding: '16px' }}
                            className={`cursor-default text-5xl lg:text-9xl md:text-8xl sm:text-6xl relative after:bg-black after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 ${player === Player.X ? 'after:w-full' : 'after:w-0'}`}
                        >
                            X
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {board.map((cell: number, index: number) => {
                            const gameover: boolean = win || draw
                            const clicker =
                                cell === 0 && !gameover
                                    ? makePlay(index)
                                    : () => null
                            return (
                                <div
                                    className="w-9 h-9 text-2xl lg:w-25 lg:h-25 lg:text-8xl sm:w-20 sm:h-20 sm:text-7xl bg-white border-2 font-semibold text-center content-center text-black hover:bg-neutral-200 hover:cursor-pointer rounded shadow"
                                    onClick={clicker}
                                >
                                    {
                                        PlayerMark[
                                            cell as keyof typeof PlayerMark
                                        ]
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <div style={{ padding: '16px' }}>
                        <div
                            style={{ margin: '8px', padding: '16px' }}
                            className={`cursor-default text-5xl lg:text-9xl md:text-8xl sm:text-6xl relative after:bg-black after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 ${player === Player.O ? 'after:w-full' : 'after:w-0'}`}
                        >
                            O
                        </div>
                    </div>
                </div>
                <div className="flex items-center transition-opacity duration-300">
                    <button
                        className="m-10 w-50 text-3xl md:w-80 md:text-5xl text-white rotate-350 bg-rose-300 hover:text-rose-300 hover:bg-white hover:cursor-pointer"
                        onClick={() => setQuitting(true)}
                    >
                        Game Over?
                    </button>
                </div>
            </div>
            <Modal
                isOpen={win || draw || quit != Player.None}
                title={getGameOverTitle()}
            >
                <button
                    className="text-3xl hover:text-blue-500 hover:cursor-pointer"
                    onClick={newGame}
                >
                    Try Again?
                </button>
            </Modal>
            <Modal isOpen={quitting} title="Are you sure?">
                <div>
                    <button
                        className="text-3xl hover:text-blue-500 hover:cursor-pointer"
                        onClick={quitGame}
                    >
                        Yes
                    </button>
                    <button
                        className="text-3xl hover:text-blue-500 hover:cursor-pointer"
                        onClick={() => setQuitting(false)}
                    >
                        No
                    </button>
                </div>
            </Modal>
            <Modal isOpen={networkError} title="Lost Network Connection">
                <div>
                    <button
                        className="text-3xl hover:text-blue-500 hover:cursor-pointer"
                        onClick={testNetworkConnection}
                    >
                        Try Again?
                    </button>
                </div>
            </Modal>
        </>
    )
}
