import React from 'react';
import Stat from './Stat';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    onBack?: () => void;
    lives?: number;
    score?: number;
    level?: number;
    timer?: number;
    progress?: number;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, onBack, lives, score, level, timer, progress }) => (
    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: progress !== undefined ? 12 : 0 }}>
            {onBack ? (
                <button onClick={onBack} className="btn-ghost">
                    ← Retour
                </button>
            ) : (
                <div style={{ width: 80 }} />
            )}
            <div style={{ textAlign: 'center', flex: 1 }}>
                {title && <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h1>}
                {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
            </div>
            <div style={{ width: 80 }} />
        </div>
        {(lives !== undefined || score !== undefined || level !== undefined || timer !== undefined) && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 8 }}>
                {lives !== undefined && <Stat label="VIES" value={'❤️'.repeat(Math.max(0, lives))} />}
                {score !== undefined && <Stat label="SCORE" value={score} color="var(--yellow)" />}
                {level !== undefined && <Stat label="NIVEAU" value={level} color="var(--cyan)" />}
                {timer !== undefined && <Stat label="TEMPS" value={`${timer}s`} color={timer <= 5 ? 'var(--red)' : 'var(--orange)'} />}
            </div>
        )}
        {progress !== undefined && (
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
        )}
    </div>
);

export default Header;
