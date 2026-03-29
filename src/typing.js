import React, { useEffect, useRef, useState } from 'react'

export default function Typing() {
    // let arr = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    // let arr = ['A', 'S', 'D', 'F', 'H', 'J', 'K', 'L'];
    let arr = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
    const getChar = () => arr[Math.floor(Math.random() * arr.length)];

    let [char, setChar] = useState(getChar());
    const [pressed, setPressed] = useState([]);
    let [top, setTop] = useState(0);
    let [left, setLeft] = useState(50);
    let [h, setH] = useState(0);
    let stopRef = useRef(false);

    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            setH(containerRef.current.offsetHeight);
            setLeft(Math.floor(Math.random() * containerRef.current.offsetWidth))
        }
    }, []);

    useEffect(() => {
        const detectKeyDown = (e) => {
            setPressed((old) => {
                return [...old, { key: e.key.toUpperCase(), correct: e.key.toUpperCase() === char }]
            })
            setChar(getChar()); // no mutation
            setLeft(Math.floor(Math.random() * containerRef.current.offsetWidth))
            setTop(0); // reset position
        };

        document.addEventListener('keydown', detectKeyDown, true);
        return () => document.removeEventListener('keydown', detectKeyDown, true);
    }, [char]);

    function start() {
        stopRef.current = false;
        setTimeout(function tick() {
            if (stopRef.current) return; // stop immediately
            setTop(prevTop => {
                if (prevTop >= (h - 35)) {
                    setLeft(Math.floor(Math.random() * containerRef.current.offsetWidth))
                    setChar(getChar());
                    return 0;
                }
                return prevTop + 1;
            });
            setTimeout(tick, 20);
        }, 20);
    }

    function pause() {
        stopRef.current = true;
    }

    return (
        <>
            <div className='container'>
                <div>
                    <h2>
                        {
                            arr.map(c => { return <span>{c},</span> })
                        }
                    </h2>
                    <div>
                        <input type='button' value='start' onClick={start} />&nbsp;
                        <input type='button' value='stop' onClick={pause} />
                    </div>
                </div>
                <div ref={containerRef} style={{ flex: '1' }}>
                    <div
                        key={char + top} // force restart
                        style={{ top: `${top}px`, left: `${left}px`, position: 'relative' }}
                        className="char"
                    >
                        {char}
                    </div>
                </div>
                <div className='output'>
                    {
                        pressed.map((p, index) => {
                            return <div className='user-item'
                                key={'p_' + index}
                                style={{
                                    backgroundColor: p.correct ? '#3aaf61ff' : '#cf435aff',
                                }}
                            >
                                {p.key}
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    );
}
