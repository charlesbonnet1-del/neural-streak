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
    const [phase, setPhase] = useState<'tutorial' | 'practice' | 'countdown' | 'playing' | 'result'>('tutorial');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [practiceRounds, setPracticeRounds] = useState(0);
    const gameInfo = GAMES[gameId];
    const { addScore } = useProgression();

    const handleScore = useCallback((s: number) => {
        if (phase === 'playing') {
            setScore((prev) => prev + s);
        } else if (phase === 'practice') {
            setPracticeRounds((prev) => prev + 1);
        }
    }, [phase]);

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
        return (
            <ResultScreen
                score={score}
                onRetry={() => {
                    setScore(0);
                    setTimeLeft(60);
                    setPracticeRounds(0);
                    setPhase('tutorial');
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
                        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                            <button className="btn btn-secondary" onClick={() => setPhase('countdown')} style={{ flex: 1 }}>
                                Passer le test
                            </button>
                            <button className="btn btn-primary" onClick={() => setPhase('practice')} style={{ flex: 1 }}>
                                Essayer (2 tours)
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Header
                title={gameInfo.name + (phase === 'practice' ? ' (Entraînement)' : '')}
                onBack={onBack}
                score={score}
                timer={phase === 'playing' ? timeLeft : undefined}
                progress={phase === 'playing' ? ((60 - timeLeft) / 60) * 100 : (practiceRounds / 2) * 100}
            />
            <div style={{ flex: 1, position: 'relative' }}>
                {children({ onScore: handleScore, isActive: phase === 'playing' || phase === 'practice' })}

                {phase === 'practice' && practiceRounds >= 2 && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(5,5,10,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        backdropFilter: 'blur(4px)'
                    }}>
                        <Card style={{ textAlign: 'center', maxWidth: 300 }}>
                            <h3 style={{ marginBottom: 16 }}>Test terminé !</h3>
                            <p style={{ marginBottom: 24, color: 'var(--text-secondary)' }}>
                                Vous avez complété les tours d'essai. Prêt à commencer ?
                            </p>
                            <button className="btn btn-primary" onClick={() => setPhase('countdown')} style={{ width: '100%' }}>
                                Démarrer la session
                            </button>
                        </Card>
                    </div>
                )}
            </div>
            {phase === 'countdown' && (
                <CountdownOverlay count={3} onComplete={() => setPhase('playing')} />
            )}
        </div>
    );
};

export default GameContainer;
