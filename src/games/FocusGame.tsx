import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import { COLORS, COLOR_HEX } from '../data/gameData';
import { pick } from '../utils/helpers';
import { Color } from '../types';

interface FocusGameProps {
    onBack: () => void;
}

const FocusGame: React.FC<FocusGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'observe' | 'detect' | 'result'>('observe');
    const [grid, setGrid] = useState<Color[]>([]);
    const [changedGrid, setChangedGrid] = useState<Color[]>([]);
    const [changedIdx, setChangedIdx] = useState<number>(-1);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [timer, setTimer] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const maxRounds = 10;

    const gridSize = Math.min(3 + Math.floor(level / 3), 5);

    const generateRound = useCallback(() => {
        const size = gridSize * gridSize;
        const newGrid = Array.from({ length: size }, () => pick(COLORS));
        setGrid(newGrid);

        // Choose a random cell to change
        const idx = Math.floor(Math.random() * size);
        const originalColor = newGrid[idx];
        const newColor = pick(COLORS.filter((c) => c !== originalColor));

        const changed = [...newGrid];
        changed[idx] = newColor;
        setChangedGrid(changed);
        setChangedIdx(idx);
        setTimer(3);
        setPhase('observe');
        setFeedback(null);
    }, [gridSize]);

    useEffect(() => {
        generateRound();
    }, []);

    useEffect(() => {
        if (phase === 'observe' && timer > 0) {
            const t = setTimeout(() => setTimer((t) => t - 1), 1000);
            return () => clearTimeout(t);
        }
        if (phase === 'observe' && timer === 0) {
            setPhase('detect');
        }
    }, [phase, timer]);

    const handleCellClick = (idx: number) => {
        if (phase !== 'detect' || feedback) return;

        const isCorrect = idx === changedIdx;

        if (isCorrect) {
            setFeedback('success');
            const points = 20 + level * 5;
            setScore((s) => s + points);
            setTimeout(() => {
                if (round + 1 >= maxRounds) {
                    setPhase('result');
                } else {
                    setRound((r) => r + 1);
                    setLevel((l) => l + 1);
                    generateRound();
                }
            }, 1000);
        } else {
            setFeedback('error');
            setLives((l) => l - 1);
            if (lives <= 1) {
                setTimeout(() => setPhase('result'), 1000);
            } else {
                setTimeout(() => {
                    setRound((r) => r + 1);
                    generateRound();
                }, 1200);
            }
        }
    };

    if (phase === 'result') {
        return (
            <ResultScreen
                score={score}
                level={level}
                stats={{ 'Rounds': `${round}/${maxRounds}` }}
                onRetry={() => {
                    setRound(0);
                    setScore(0);
                    setLives(3);
                    setLevel(1);
                    generateRound();
                }}
                onBack={onBack}
            />
        );
    }

    const displayGrid = phase === 'observe' ? grid : changedGrid;
    const cellSize = Math.max(50, Math.floor(280 / gridSize));

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header
                title="Focus Soutenu"
                subtitle={phase === 'observe' ? 'Observe attentivement...' : 'Trouve la case qui a changé !'}
                onBack={onBack}
                lives={lives}
                score={score}
                level={level}
                timer={phase === 'observe' ? timer : undefined}
                progress={(round / maxRounds) * 100}
            />
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                }}
            >
                <div
                    className={feedback === 'error' ? 'shake' : ''}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
                        gap: 8,
                    }}
                >
                    {displayGrid.map((color, idx) => {
                        let borderColor = 'transparent';
                        if (feedback && idx === changedIdx) {
                            borderColor = feedback === 'success' ? 'var(--green)' : 'var(--red)';
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleCellClick(idx)}
                                disabled={phase === 'observe' || !!feedback}
                                style={{
                                    width: cellSize,
                                    height: cellSize,
                                    borderRadius: 'var(--radius-sm)',
                                    border: `3px solid ${borderColor}`,
                                    background: COLOR_HEX[color],
                                    cursor: phase === 'detect' && !feedback ? 'pointer' : 'default',
                                    transition: 'all 0.15s ease',
                                    transform: feedback && idx === changedIdx ? 'scale(1.1)' : 'scale(1)',
                                }}
                            />
                        );
                    })}
                </div>

                {phase === 'observe' && (
                    <p style={{ marginTop: 24, color: 'var(--text-secondary)' }}>
                        👁️ Mémorise la grille...
                    </p>
                )}

                {phase === 'detect' && !feedback && (
                    <p style={{ marginTop: 24, color: 'var(--cyan)' }}>
                        Clique sur la case qui a changé de couleur !
                    </p>
                )}

                {feedback === 'success' && (
                    <div className="scaleIn" style={{ marginTop: 24, color: 'var(--green)', fontWeight: 700 }}>
                        ✓ Bien vu !
                    </div>
                )}

                {feedback === 'error' && (
                    <div className="scaleIn" style={{ marginTop: 24, color: 'var(--red)', fontWeight: 700 }}>
                        ✗ Pas celle-là...
                    </div>
                )}
            </div>
        </div>
    );
};

export default FocusGame;
