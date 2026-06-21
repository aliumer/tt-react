import React, { useEffect, useRef, useState } from 'react';
import correctSound1 from './sounds/keyboard5-88069.mp3'
import correctSound2 from './sounds/typing-sound-01-229863.mp3'

export default function App() {
    const arr = ['A', 'Q', 'U', 'I', 'C', 'K', 'B', 'R', 'O', 'W', 'N', 'F', 'O', 'X', 'J', 'U', 'M', 'P', 'E', 'D', 'O', 'V', 'E', 'R', 'T', 'H', 'E', 'W', 'H', 'I', 'T', 'E', 'L', 'A', 'Z', 'Y', 'D', 'O', 'G'];
    const getChar = () => arr[Math.floor(Math.random() * arr.length)];

    const [char, setChar] = useState(getChar());
    const [top, setTop] = useState(0);
    const [h, setH] = useState(0);

    const [pressed, setPressed] = useState([]); // store pressed keys

    const containerRef = useRef(null);
    const stopRef = useRef(true);
    const frameIdRef = useRef(null);
    const lastTimeRef = useRef(0);

        // --- SOUND SETUP -----------------------------------------------------
    // Preload the two correct-key sounds once, using refs so they persist
    // across renders without being re-created every time.
    const correctAudiosRef = useRef([]);
    const audioCtxRef = useRef(null); // for the synthesized "incorrect" beep

    useEffect(() => {
        correctAudiosRef.current = [
            new Audio(correctSound1),
            new Audio(correctSound2)
        ];
        // Optional: lower volume a touch so it's not jarring on every keystroke
        correctAudiosRef.current.forEach(a => { a.volume = 0.6; });

        // Lazily create the AudioContext used for the incorrect-key beep.
        // (Created here, but actually "unlocked" on first user keypress below.)
        return () => {
            // cleanup on unmount
            correctAudiosRef.current.forEach(a => {
                a.pause();
                a.src = '';
            });
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    function playCorrectSound() {
        const sounds = correctAudiosRef.current;
        if (!sounds.length) return;
        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        sound.currentTime = 0; // rewind so rapid typing doesn't get cut off
        sound.play().catch(() => {
            // Autoplay may be blocked until the user interacts with the page;
            // safe to ignore.
        });
    }

    function playIncorrectSound() {
        // Synthesized short "error" beep via Web Audio API — no file needed.
        // Swap this out for a real Audio() + mp3 import if you add a 3rd file later.
        try {
            if (!audioCtxRef.current) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                audioCtxRef.current = new AudioCtx();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(160, ctx.currentTime); // low buzzy tone

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (err) {
            // Web Audio not available — fail silently
        }
    }
    // -----------------------------------------------------------------------

    useEffect(() => {
        if (containerRef.current) {
            setH(containerRef.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        const detectKeyDown = (e) => {
            const key = e.key.toUpperCase(); // normalize to uppercase
            if (!arr.includes(key)) return; // ignore keys outside allowed ones

            const isCorrect = key === char;


            // track pressed key with correctness info
            setPressed(prev => [
                ...prev,
                { key, correct: key === char }
            ]);

            // play sound based on correctness
            if (isCorrect) {
                playCorrectSound();
                setChar(getChar());
                setTop(0);
            } else {
                playIncorrectSound();
            }

        };

        document.addEventListener('keydown', detectKeyDown, true);
        return () => document.removeEventListener('keydown', detectKeyDown, true);
    }, [char]);

    function loop(timestamp) {
        if (stopRef.current) return;

        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const delta = timestamp - lastTimeRef.current;

        if (delta > 10) {
            setTop(prevTop => {
                if (prevTop >= h) {
                    setChar(getChar());
                    return 0;
                }
                return prevTop + 1;
            });
            lastTimeRef.current = timestamp;
        }

        frameIdRef.current = requestAnimationFrame(loop);
    }

    function start() {
        stopRef.current = false;
        cancelAnimationFrame(frameIdRef.current);
        lastTimeRef.current = 0;
        frameIdRef.current = requestAnimationFrame(loop);
    }

    function pause() {
        stopRef.current = true;
        cancelAnimationFrame(frameIdRef.current);
    }

    function clear() {
        setPressed([]);
    }

    return (
        <div>
            <div className='container'>
                <div className='flexItem'>
                    <h3>Typing Tutor</h3>
                    <div style={{ marginBottom: '8px' }}>
                        <input type='button' value='start' onClick={start} />
                        <input type='button' value='stop' onClick={pause} style={{ marginLeft: '8px' }} />
                        <input type='button' value='clear' onClick={clear} style={{ marginLeft: '8px' }} />
                    </div>
                </div>
                <div ref={containerRef} className='flexItem' style={{ flex: '1', position: 'relative' }}>
                    <div
                        key={char + top}
                        style={{ top: `${top}px`, position: 'relative' }}
                        className="char"
                    >
                        {char}
                    </div>
                </div>
            </div>

            {/* Pressed keys display */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                {pressed.map((p, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: p.correct ? 'green' : 'red',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        {p.key}
                    </div>
                ))}
            </div>
        </div>
    );
}
