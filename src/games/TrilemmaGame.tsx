import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import { TRILEMMA_DATA } from '../data/gameData';
import { TrilemmaData } from '../types';
import Stat from '../components/Stat';

interface TrilemmaGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const TrilemmaGame: React.FC<TrilemmaGameProps> = ({ onScore, isActive }) => {
    const [current, setCurrent] = useState<TrilemmaData | null>(null);
    const [level, setLevel] = useState(1);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);

    const next = useCallback(() => {
        if (!isActive) return;
        const avail = TRILEMMA_DATA.map((_, i) => i).filter((i) => !used.includes(i));

        let pool = avail;
        if (pool.length === 0) pool = TRILEMMA_DATA.map((_, i) => i);

        const idx = Math.floor(Math.random() * pool.length);
        const actualIdx = pool[idx];

        setUsed((p: number[]) => (pool.length === TRILEMMA_DATA.length ? [actualIdx] : [...p, actualIdx]));
        setCurrent(TRILEMMA_DATA[actualIdx]);
        setFeedback(null);
    }, [used, isActive]);

    useEffect(() => {
        if (isActive) {
            next();
        } else {
            setLevel(1);
            setUsed([]);
            setCurrent(null);
        }
    }, [isActive]);

    const handleAnswer = (ans: 'true' | 'false' | 'unknown') => {
        if (!isActive || !current || feedback) return;

        const isCorrect = ans === current.answer;

        if (isCorrect) {
            setFeedback('success');
            onScore(level * 25);
            setTimeout(() => {
                setLevel((l: number) => l + 1);
                next();
            }, 1000);
        } else {
            setFeedback('error');
            setTimeout(() => {
                next();
            }, 1200);
        }
    };

    if (!isActive) return null;

    const flashClass = feedback === 'success' ? 'flash-success' : feedback === 'error' ? 'flash-error' : '';

    const options = [
        { id: 'true' as const, label: 'FAIT PROUVÉ', color: 'var(--green)', icon: '✓', sub: 'Scientifique / Factuel' },
        { id: 'false' as const, label: 'CONTRE-VÉRITÉ', color: 'var(--red)', icon: '✗', sub: 'Mythe / Erreur' },
        { id: 'unknown' as const, label: 'INCERTAIN', color: 'var(--yellow)', icon: '?', sub: 'Futur / Spéculatif' },
    ];

    return (
        <div
            className={`fadeIn ${flashClass}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                transition: 'background-color 0.4s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Stat label="NIVEAU" value={level} color="var(--purple)" />
            </div>

            {/* Feedback Overlays */}
            {feedback === 'success' && (
                <div className="scaleIn" style={{
                    position: 'absolute',
                    zIndex: 10,
                    fontSize: '10rem',
                    color: 'var(--green)',
                    pointerEvents: 'none',
                    opacity: 0.8,
                    filter: 'drop-shadow(0 0 20px rgba(56, 142, 60, 0.4))'
                }}>
                    ✓
                </div>
            )}
            {feedback === 'error' && (
                <div className="shake" style={{
                    position: 'absolute',
                    zIndex: 10,
                    fontSize: '10rem',
                    color: 'var(--red)',
                    pointerEvents: 'none',
                    opacity: 0.8,
                    filter: 'drop-shadow(0 0 20px rgba(211, 47, 47, 0.4))'
                }}>
                    ✗
                </div>
            )}

            <div style={{ width: '100%', maxWidth: 640 }}>
                <p style={{
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    marginBottom: 16,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    fontWeight: 700
                }}>
                    Vigilance Épistémique
                </p>

                {current && (
                    <Card style={{
                        padding: '40px 32px',
                        marginBottom: 40,
                        border: 'none',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 'var(--radius-lg)',
                        minHeight: 180,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <p style={{
                            fontSize: '1.3rem',
                            lineHeight: 1.5,
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            fontWeight: 500,
                            fontFamily: 'var(--font-display)'
                        }}>
                            "{current.statement}"
                        </p>
                    </Card>
                )}

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 16,
                        width: '100%'
                    }}>
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                className="btn"
                                onClick={() => handleAnswer(opt.id)}
                                disabled={!!feedback}
                                style={{
                                    height: 110,
                                    borderRadius: 'var(--radius-lg)',
                                    border: 'none',
                                    color: opt.color,
                                    background: 'white',
                                    boxShadow: feedback ? 'none' : `0 6px 0 ${opt.id === 'unknown' ? 'rgba(251, 192, 45, 0.2)' : opt.color + '1a'}, 0 10px 20px rgba(0,0,0,0.04)`,
                                    transform: feedback ? 'translateY(4px)' : 'none',
                                    transition: 'all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '12px 8px',
                                    opacity: feedback && feedback === 'error' && current?.answer === opt.id ? 1 : feedback ? 0.3 : 1
                                }}
                            >
                                <span style={{ fontSize: '1.4rem', marginBottom: 4 }}>{opt.icon}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.02em', lineHeight: 1.1 }}>{opt.label}</span>
                                <span style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: 4, fontWeight: 500 }}>{opt.sub}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrilemmaGame;
