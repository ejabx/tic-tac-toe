import { useEffect, useState } from 'react'
import { api } from '../services/api'
import Modal from './Modal'
import ThinkBubble from './ThinkBubble'
import Toggle from './Toggle'
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
    const [playerMark, setPlayerMark] = useState<
        typeof Player.X | typeof Player.O
    >(Player.X)
    const [player, setPlayer] = useState<typeof Player.X | typeof Player.O>(
        playerMark
    )
    const [computerOpponent, setComputerComponent] = useState<
        typeof Player.None | typeof Player.X | typeof Player.O
    >(Player.O)
    const [board, setBoard] = useState(Array(9).fill(Player.None))
    const [win, setWin] = useState<boolean>(false)
    const [draw, setDraw] = useState<boolean>(false)
    const [quit, setQuit] = useState<boolean>(false)
    const [quitting, setQuitting] = useState<boolean>(false)
    const [networkError, setNetworkError] = useState<boolean>(false)
    const [thinking, setThinking] = useState<boolean>(false)

    useEffect(() => {
        refreshBoard()
    }, [player, win, draw, networkError])

    useEffect(() => {
        api.post(`/switch-to-computer/${computerOpponent}`).catch((err) => {
            throw err
        })
    }, [computerOpponent])

    useEffect(() => {
        if (player === computerOpponent && !win && !draw) {
            setThinking(true)
            setTimeout(() => makePlay(computerOpponent, 0)(), 1000) // index doesn't matter. backend will compute
        }
    }, [player, win, draw])

    const refreshBoard = async () => {
        return api
            .get('/board')
            .then((res) => setBoard(res.data))
            .catch((err) => {
                throw err
            })
    }

    const makePlay = (player: number, position: number) => () => {
        api.post(`/move/${player}/${position}`)
            .then(async (res) => {
                const { isWin, isDraw } = res.data

                await refreshBoard()
                setWin(isWin)
                setDraw(isDraw)
                setThinking(false)

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
        api.post('/reset')
            .then(refreshBoard)
            .then(() => {
                setPlayer(Player.X)
                setComputerComponent(
                    computerOpponent === Player.None
                        ? Player.None
                        : playerMark === Player.X
                          ? Player.O
                          : Player.X
                )
                setWin(false)
                setDraw(false)
                setQuit(false)
            })
            .catch((err) => {
                console.error(err)
                setNetworkError(true)
            })
    }

    const quitGame = () => {
        setQuitting(false)
        setQuit(true)
    }

    const configPlayer = (index: number) => {
        if (index === 0) {
            setPlayerMark(Player.X)
        } else {
            setPlayerMark(Player.O)
        }
    }

    const configComputer = (index: number) => {
        if (index === 0) {
            setComputerComponent(Player.None)
        } else {
            setComputerComponent(Player.X ? Player.O : Player.X)
        }
    }

    const testNetworkConnection = () => {
        setNetworkError(false)
        refreshBoard().catch((err) => {
            console.error(err)
            setNetworkError(true)
        })
    }

    const getGameOverTitle = () => {
        if (win) {
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
        } else if (quit) {
            return 'New Game'
        }

        return 'Draw'
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="text-6xl m-10 text-black dark:text-white font-bold">
                    Tic Tac Toe
                </div>
                <div className="flex flex-row items-center">
                    <div style={{ padding: '16px' }}>
                        <div
                            style={{ margin: '8px', padding: '16px' }}
                            className={`cursor-default text-5xl dark:text-white lg:text-9xl md:text-8xl sm:text-6xl relative dark:after:bg-white after:bg-black after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 ${player === Player.X ? 'after:w-full' : 'after:w-0'}`}
                        >
                            X
                            {thinking && computerOpponent === Player.X ? (
                                <div className="absolute -top-10 right-5 sm:right-10">
                                    <ThinkBubble />
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {board.map((cell: number, index: number) => {
                            const isGameOver: boolean = win || draw
                            const isValidCell: boolean =
                                cell === 0 &&
                                !isGameOver &&
                                !(computerOpponent === player)
                            const clicker = isValidCell
                                ? makePlay(player, index)
                                : () => null
                            const hoverStyle = isValidCell
                                ? 'hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-500'
                                : 'hover:cursor-default'
                            return (
                                <div
                                    data-player-marker-preview={
                                        isValidCell
                                            ? PlayerMark[
                                                  player as keyof typeof PlayerMark
                                              ]
                                            : ''
                                    }
                                    className={`boardcell w-9 h-9 text-2xl lg:w-25 lg:h-25 lg:text-8xl sm:w-20 sm:h-20 sm:text-7xl bg-white dark:bg-black dark:text-white border-2 font-semibold text-center content-center text-black hover:after:opacity-10 hover:after:content-[attr(data-player-marker-preview)] ${hoverStyle} rounded shadow"`}
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
                            className={`cursor-default text-5xl dark:text-white lg:text-9xl md:text-8xl sm:text-6xl relative after:bg-black dark:after:bg-white after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 ${player === Player.O ? 'after:w-full' : 'after:w-0'}`}
                        >
                            O
                            {thinking && computerOpponent === Player.O ? (
                                <div className="absolute -top-10 right-5 sm:right-10">
                                    <ThinkBubble />
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center transition-opacity duration-300">
                    <button
                        className="m-10 w-50 text-3xl md:w-80 md:text-5xl text-white dark:text-black rotate-350 bg-rose-300 hover:text-rose-300 hover:bg-white hover:cursor-pointer"
                        onClick={() => setQuitting(true)}
                    >
                        New Game?
                    </button>
                </div>
            </div>
            <>
                <Modal isOpen={win || draw || quit} title={getGameOverTitle()}>
                    <div className="flex flex-col mx-3 my-4">
                        <Toggle
                            label="Player Mark"
                            options={['X', 'O']}
                            onSelect={configPlayer}
                            defaultIndex={playerMark === Player.X ? 0 : 1}
                        />
                        <Toggle
                            label="Computer"
                            options={['Off', 'Normal', 'Hard']}
                            onSelect={configComputer}
                            defaultIndex={computerOpponent === 0 ? 0 : 1}
                        />
                    </div>
                    <button
                        className="text-3xl dark:text-black hover:text-blue-500 hover:cursor-pointer"
                        onClick={newGame}
                    >
                        Start
                    </button>
                </Modal>
                <Modal isOpen={quitting} title="Are you sure?">
                    <div>
                        <button
                            className="text-3xl dark:text-black hover:text-blue-500 hover:cursor-pointer"
                            onClick={quitGame}
                        >
                            Yes
                        </button>
                        <button
                            className="text-3xl dark:text-black hover:text-blue-500 hover:cursor-pointer"
                            onClick={() => setQuitting(false)}
                        >
                            No
                        </button>
                    </div>
                </Modal>
                <Modal isOpen={networkError} title="Lost Network Connection">
                    <div>
                        <button
                            className="text-3xl dark:text-black hover:text-blue-500 hover:cursor-pointer"
                            onClick={testNetworkConnection}
                        >
                            Try Again?
                        </button>
                    </div>
                </Modal>
            </>
        </>
    )
}
