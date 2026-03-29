import React, { useState, useRef, useEffect } from 'react'


export default function Mouse() {
    const [show, setShow] = useState(false);
    let [top, setTop] = useState(0);
    let [left, setLeft] = useState(50);
    let [h, setH] = useState(0);
    const containerRef = useRef(null);

    const handleStart = () => {
        setShow(true);
    }

    useEffect(() => {
        if (containerRef.current) {
            setTop(Math.floor(Math.random() * containerRef.current.offsetHeight));
            setLeft(Math.floor(Math.random() * containerRef.current.offsetWidth))
        }
    }, []);


    const handleItemClick = () => {
        setShow(false);
        setTimeout(() => {
            setTop(Math.floor(Math.random() * containerRef.current.offsetHeight));
            setLeft(Math.floor(Math.random() * containerRef.current.offsetWidth))
            setShow(true);
        }, 1000);
    }


    return (
        <>
            <div className="container">
                <input type="button" value="Start" onClick={handleStart} />
                <div ref={containerRef} style={{ flex: '1' }}>
                    <div onClick={handleItemClick}
                        key={top} // force restart
                        style={{ top: `${top}px`, left: `${left}px`, position: 'relative', display: show ? 'block' : 'none', }}
                        className="char"
                    >
                        X
                    </div>
                </div>
            </div>
        </>
    )
}

