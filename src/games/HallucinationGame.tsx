import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { HALLUCINATION_DATA } from '../data/gameData';
import { pick } from '../utils/helpers';
import { HallucinationData } from '../types';

import Stat from '../components/Stat';

interface HallucinationGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const HallucinationGame: React.FC<HallucinationGameProps> = ({ onScore, isActive }) => {
    const [current, setCurrent] = useState<HallucinationData | null>(null);
    const [level, setLevel] = useState(1);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);

    const next = useCallback(() => {
        if (!isActive) return;
        const avail = HALLUCINATION_DATA.map((_, i) => i).filter((i) => !used.includes(i));

        let pool = avail;
        if (pool.length === 0) pool = HALLUCINATION_DATA.map((_, i) => i);

        const idx = pick(pool);
        setUsed((p: number[]) => (pool.length === HALLUCINATION_DATA.length ? [idx] : [...p, idx]));
        setCurrent(HALLUCINATION_DATA[idx]);
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

    const handleAnswer = (hasErr: boolean) => {
        if (!isActive || !current || feedback) return;

        const isCorrect = hasErr === current.hasError;

        if (isCorrect) {
            setFeedback('success');
            onScore(level * 30);
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
                <Stat label="NIVEAU" value={level} color="var(--blue)" />
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
                {current && (
                    <Card style={{
                        padding: '48px 32px',
                        marginBottom: 48,
                        border: 'none',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        <p style={{
                            fontSize: '1.4rem',
                            lineHeight: 1.6,
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            fontWeight: 500,
                            fontFamily: 'var(--font-display)'
                        }}>
                            "{current.text}"
                        </p>

                        {feedback === 'error' && current.hasError && (
                            <div className="fadeIn" style={{
                                marginTop: 32,
                                padding: 20,
                                background: 'rgba(211, 47, 47, 0.05)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid rgba(211, 47, 47, 0.1)',
                                textAlign: 'center'
                            }}>
                                <p style={{ color: 'var(--red)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Logique rompue :</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{current.error}</p>
                            </div>
                        )}
                    </Card>
                )}

                <div style={{ textAlign: 'center' }}>
                    <p style={{
                        color: 'var(--text-muted)',
                        marginBottom: 24,
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontWeight: 600
                    }}>
                        Détectez-vous une hallucination ?
                    </p>

                    <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
                        <button
                            className="btn"
                            onClick={() => handleAnswer(false)}
                            disabled={!!feedback}
                            style={{
                                flex: 1,
                                height: 80,
                                borderRadius: 'var(--radius-lg)',
                                border: 'none',
                                color: 'var(--green)',
                                background: 'white',
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                boxShadow: feedback === 'success' ? 'none' : '0 8px 0 rgba(56, 142, 60, 0.1), 0 15px 30px rgba(56, 142, 60, 0.05)',
                                transform: feedback ? 'translateY(6px)' : 'none',
                                transition: 'all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: 4, letterSpacing: '0.1em' }}>VALIDE</span>
                            ✓ CORRECT
                        </button>
                        <button
                            className="btn"
                            onClick={() => handleAnswer(true)}
                            disabled={!!feedback}
                            style={{
                                flex: 1,
                                height: 80,
                                borderRadius: 'var(--radius-lg)',
                                border: 'none',
                                color: 'var(--red)',
                                background: 'white',
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                boxShadow: feedback === 'error' ? 'none' : '0 8px 0 rgba(211, 47, 47, 0.1), 0 15px 30px rgba(211, 47, 47, 0.05)',
                                transform: feedback ? 'translateY(6px)' : 'none',
                                transition: 'all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: 4, letterSpacing: '0.1em' }}>HALLUCINATION</span>
                            ✗ ERREUR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallucinationGame;
