import React from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';

const AnimatedBar = ({ pct, gold }) => {

    const ref = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => {
            if (ref.current) ref.current.style.width = pct + '%';
        }, 200)
        return () => clearTimeout(t);
    }, [pct]);

    return (
        <div className='h-2.5 bg-blue-100 rounded-full overflow-hidden'>
            <div ref={ref} style={{ width: '0%', transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)' }} className={`h-full rounded-full ${gold
                ? 'bg-linear-to-r from-amber-400 to-yellow-300'
                : 'bg-blue-500'}`} />
        </div>
    )
}

export default AnimatedBar;