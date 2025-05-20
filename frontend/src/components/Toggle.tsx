import React, { useState, useEffect } from 'react'
import './Toggle.css'

type ToggleProps = {
    label: string
    options: string[]
    defaultIndex?: number
    onSelect?: (index: number) => void
}

const Toggle: React.FC<ToggleProps> = ({
    label,
    options,
    defaultIndex,
    onSelect,
}) => {
    const [selection, setSelection] = useState<number>(defaultIndex ?? 0)

    useEffect(() => {
        onSelect && onSelect(selection)
    }, [selection])

    return (
        <>
            <div className="flex flex-row items-center">
                <label className="ms-3 text-2xl font-semibold text-gray-900">
                    {label}
                </label>
                <div className="inline-flex m-2">
                    <div
                        className={`flex bg-neutral-400 h-16 rounded font-semibold cursor-pointer`}
                    >
                        {options.map((option, i) => (
                            <span
                                key={i}
                                className={`p-3 m-1 min-w-30 text-3xl ${selection === i ? 'text-black  bg-neutral-200' : 'text-white  bg-neutral-400'} rounded`}
                                onClick={() => setSelection(i)}
                            >
                                {option}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Toggle
