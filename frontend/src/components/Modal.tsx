import React from 'react'
import './Modal.css'

type ModalProps = {
    isOpen: boolean
    children: React.ReactNode
    title?: string | React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, title }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 opacity-90 backdrop-blur-md transition-opacity">
            <div
                className="bg-white rounded-lg shadow-xl p-0 w-full max-w-md mx-4 relative"
                onClick={(e) => e.stopPropagation()} // prevent modal from closing when clicking inside
            >
                {title && <h1 className="text-9xl font-bold mb-4">{title}</h1>}
                {children}
            </div>
        </div>
    )
}

export default Modal
