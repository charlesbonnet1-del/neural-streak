import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import ResultScreen from './ResultScreen';
import Card from './Card';
import CountdownOverlay from './CountdownOverlay';
import { GAMES } from '../data/gameData';
import { useProgression } from '../context/ProgressionContext';

interface GameContainerProps {
    gameId: string;
    onBack: () => void;
    children: (props: { onScore: (score: number) => void; isActive: boolean }) => React.ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({ gameId, onBack, children }) => {
    const [phase, setPhase] = useState<'tutorial' | 'countdown' | 'playing' | 'result'>('tutorial');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const gameInfo = GAMES[gameId];
    const { addScore } = useProgression();

    const handleScore = useCallback((s: number) => {
        setScore((prev) => prev + s);
    }, []);

    const finishGame = useCallback(() => {
        setPhase('result');
        addScore(gameId, gameInfo.categoryId, score);
    }, [gameId, gameInfo.categoryId, score, addScore]);

    useEffect(() => {
        if (phase === 'playing' && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev: number) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (phase === 'playing' && timeLeft === 0) {
            finishGame();
        }
    }, [phase, timeLeft, finishGame]);

    if (phase === 'result') {
        const game = gameInfo;
        return (
            <ResultScreen
                score={score}
                onRetry={() => {
                    setScore(0);
                    setTimeLeft(60);
                    setPhase('countdown');
                }}
                onBack={onBack}
            />
        );
    }

    if (phase === 'tutorial') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header title={gameInfo.name} onBack={onBack} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <Card style={{ textAlign: 'center', maxWidth: 400 }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>{gameInfo.icon}</div>
                        <h2 style={{ marginBottom: 12 }}>Tutoriel</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                            {gameInfo.tutorial}
                        </p>
                        <button className="btn btn-primary" onClick={() => setPhase('countdown')} style={{ width: '100%' }}>
                            C'est parti !
                        </button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Header
                title={gameInfo.name}
                onBack={onBack}
                score={score}
                timer={timeLeft}
                progress={((60 - timeLeft) / 60) * 100}
            />
            <div style={{ flex: 1, position: 'relative' }}>
                {children({ onScore: handleScore, isActive: phase === 'playing' })}
            </div>
            {phase === 'countdown' && (
                <CountdownOverlay onComplete={() => setPhase('playing')} />
            )}
        </div>
    );
};

export default GameContainer;
