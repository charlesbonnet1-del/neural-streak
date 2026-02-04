import React, { useState, useEffect } from 'react';

interface CountdownOverlayProps {
    count: number;
    onComplete: () => void;
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ count, onComplete }) => {
    const [c, setC] = useState(count);

    useEffect(() => {
        if (c > 0) {
            const t = setTimeout(() => setC((x) => x - 1), 1000);
            return () => clearTimeout(t);
        } else {
            onComplete();
        }
    }, [c, onComplete]);

    if (c === 0) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(5,5,10,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div
                className="scaleIn"
                key={c}
                style={{
                    fontSize: '8rem',
                    fontWeight: 900,
                    color: 'var(--cyan)',
                    textShadow: '0 0 60px var(--cyan)',
                }}
            >
                {c}
            </div>
        </div>
    );
};

export default CountdownOverlay;
