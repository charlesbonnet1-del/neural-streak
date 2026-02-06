import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Stat from '../components/Stat';
import { CAUSAL_DATA } from '../data/gameData';
import { CausalData } from '../types';
import { pick, shuffle } from '../utils/helpers';

interface CausalGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const CausalGame: React.FC<CausalGameProps> = ({ onScore, isActive }) => {
    const [current, setCurrent] = useState<CausalData | null>(null);
    const [userSteps, setUserSteps] = useState<string[]>([]);
    const [scrambled, setScrambled] = useState<string[]>([]);
    const [level, setLevel] = useState(1);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

    const next = useCallback(() => {
        if (!isActive) return;
        const data = pick(CAUSAL_DATA);
        setCurrent(data);
        setScrambled(shuffle([...data.steps]));
        setUserSteps([]);
        setFeedback(null);
    }, [isActive]);

    useEffect(() => {
        if (isActive) {
            next();
        } else {
            setLevel(1);
            setUserSteps([]);
            setScrambled([]);
            setCurrent(null);
        }
    }, [isActive, next]);

    const handleStepClick = (step: string) => {
        if (!isActive || feedback) return;

        const nextSteps = [...userSteps, step];
        setUserSteps(nextSteps);
        setScrambled(prev => prev.filter(s => s !== step));

        // Immediate check for error if we want, or at the end. 
        // For a chain, it's usually better to check at the end or step-by-step.
        // Let's check step-by-step to provide immediate "wrong" feedback.
        if (current && step !== current.steps[userSteps.length]) {
            setFeedback('error');
            setTimeout(() => {
                setUserSteps([]);
                setScrambled(shuffle([...current.steps]));
                setFeedback(null);
            }, 1000);
            return;
        }

        if (current && nextSteps.length === current.steps.length) {
            setFeedback('success');
            onScore(level * 50);
            setTimeout(() => {
                setLevel(l => l + 1);
                next();
            }, 1000);
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
                <Stat label="NIVEAU" value={level} color="var(--cyan)" />
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
                    Raisonnement Transitif
                </p>

                {current && (
                    <>
                        <Card style={{
                            padding: '24px 32px',
                            marginBottom: 32,
                            border: 'none',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--cyan)', fontWeight: 700 }}>
                                {current.event}
                            </h2>
                        </Card>

                        {/* Visual Chain */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            marginBottom: 40,
                            width: '100%'
                        }}>
                            {current.steps.map((_, i) => {
                                const step = userSteps[i];
                                return (
                                    <div
                                        key={i}
                                        className={step ? "fadeIn" : ""}
                                        style={{
                                            height: 56,
                                            background: step ? 'white' : 'rgba(0,0,0,0.02)',
                                            borderRadius: 'var(--radius-md)',
                                            border: step ? '1px solid rgba(0,128,128,0.1)' : '1px dashed rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 20px',
                                            boxShadow: step ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            background: step ? 'var(--cyan)' : 'rgba(0,0,0,0.1)',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 16,
                                            fontWeight: 700
                                        }}>
                                            {i + 1}
                                        </span>
                                        <span style={{
                                            color: step ? 'var(--text-primary)' : 'transparent',
                                            fontWeight: 500,
                                            fontSize: '0.95rem'
                                        }}>
                                            {step || '...'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Options */}
                        <div style={{ textAlign: 'center' }}>
                            <p style={{
                                color: 'var(--text-secondary)',
                                marginBottom: 16,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                opacity: 0.6
                            }}>
                                Cliquez sur l'étape suivante dans l'ordre logique
                            </p>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12
                            }}>
                                {scrambled.map((step, i) => (
                                    <button
                                        key={i}
                                        className="btn"
                                        onClick={() => handleStepClick(step)}
                                        disabled={!!feedback}
                                        style={{
                                            height: 64,
                                            borderRadius: 'var(--radius-md)',
                                            border: 'none',
                                            color: 'var(--text-primary)',
                                            background: 'white',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            boxShadow: feedback ? 'none' : '0 4px 0 rgba(0,0,0,0.05), 0 8px 15px rgba(0,0,0,0.03)',
                                            transform: feedback ? 'translateY(4px)' : 'none',
                                            transition: 'all 0.1s ease',
                                            cursor: 'pointer',
                                            padding: '0 16px'
                                        }}
                                    >
                                        {step}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CausalGame;
