import React from 'react'

export default function Thinking() {
    return (
        <div className="flex fixed justify-start mb-2 z-1">
            <div className="flex items-center space-x-1 bg-gray-200 text-gray-700 p-3 rounded-full w-auto max-w-[100px] shadow">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
        </div>
    )
}
