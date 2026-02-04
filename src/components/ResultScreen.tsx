import React, { useEffect } from 'react';
import Card from './Card';
import Stat from './Stat';

interface ResultScreenProps {
    score: number;
    maxScore?: number;
    level?: number;
    stats?: Record<string, string | number>;
    onRetry: () => void;
    onBack: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, maxScore, level, stats, onRetry, onBack }) => {
    const pct = maxScore ? Math.round((score / maxScore) * 100) : 0;
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎯' : pct >= 50 ? '💪' : '🔄';
    const msg = pct >= 90 ? 'Exceptionnel !' : pct >= 70 ? 'Bien joué !' : pct >= 50 ? 'Pas mal !' : 'Continue !';

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('neural_user') || '{}');
        const today = new Date().toDateString();
        const newStreak = saved.lastPlayed === today ? saved.streak : (saved.streak || 0) + 1;
        localStorage.setItem(
            'neural_user',
            JSON.stringify({
                ...saved,
                streak: newStreak,
                totalScore: (saved.totalScore || 0) + score,
                lastPlayed: today,
            })
        );
    }, [score]);

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
            }}
        >
            <div className="scaleIn" style={{ fontSize: '5rem', marginBottom: 16 }}>
                {emoji}
            </div>
            <h1 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 24 }}>
                {msg}
            </h1>
            <Card style={{ textAlign: 'center', minWidth: 280 }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--yellow)' }}>{score}</div>
                {maxScore && <div style={{ color: 'var(--text-secondary)' }}>/ {maxScore} points</div>}
                {level && <div style={{ color: 'var(--text-muted)', marginTop: 8 }}>Niveau atteint : {level}</div>}
                {stats && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 20,
                            marginTop: 16,
                            paddingTop: 16,
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        {Object.entries(stats).map(([k, v]) => (
                            <Stat key={k} label={k} value={v} color="var(--cyan)" />
                        ))}
                    </div>
                )}
            </Card>
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                <button className="btn btn-primary" onClick={onRetry}>
                    Rejouer
                </button>
                <button className="btn btn-secondary" onClick={onBack}>
                    Retour
                </button>
            </div>
        </div>
    );
};

export default ResultScreen;
