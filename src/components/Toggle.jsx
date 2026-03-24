import { ToggleLeft, ToggleRight } from 'lucide-react';
import React from 'react'
import { useState } from 'react';

const Toggle = ({ label, sub, defaultOn = true }) => {
    const [on, setOn] = useState(defaultOn);
    return (
        <div className='flex items-center justify-between py-3.5 px-5 border-b border-purple-50 last:border-0'>
            <div>
                <p className='text-sm font-semibold text-gray-900'>{label}</p>
                <p className='text-xs text-gray-400 mt-0.5'>{sub}</p>
            </div>
            <button onClick={() => setOn(v => !v)} className='transition-all duration-200 cursor-pointer'>
                {on ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512" className='text-blue-600'><path fill="currentColor" d="M368 112H144C64.6 112 0 176.6 0 256s64.6 144 144 144h224c79.4 0 144-64.6 144-144s-64.6-144-144-144m0 256a112 112 0 1 1 112-112a112.12 112.12 0 0 1-112 112" /></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 256 256" className='text-gray-600'><path fill="currentColor" d="M176 56H80a72 72 0 0 0 0 144h96a72 72 0 0 0 0-144M80 168a40 40 0 1 1 40-40a40 40 0 0 1-40 40" /></svg>}
            </button>
        </div>
    )
}

export default Toggle;