import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import Stat from '../components/Stat';
import { CAUSAL_DATA } from '../data/gameData';
import { CausalData } from '../types';
import { shuffle } from '../utils/helpers';
import { Reorder, AnimatePresence } from 'framer-motion';

interface CausalGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const CausalGame: React.FC<CausalGameProps> = ({ onScore, isActive }) => {
    const [current, setCurrent] = useState<CausalData | null>(null);
    const [items, setItems] = useState<string[]>([]);
    const [level, setLevel] = useState(1);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const next = useCallback(() => {
        if (!isActive) return;
        const data = CAUSAL_DATA[Math.floor(Math.random() * CAUSAL_DATA.length)];
        setCurrent(data);
        setItems(shuffle([...data.steps]));
        setFeedback(null);
        setIsChecking(false);
    }, [isActive]);

    useEffect(() => {
        if (isActive) {
            next();
        } else {
            setLevel(1);
            setItems([]);
            setCurrent(null);
        }
    }, [isActive, next]);

    const handleValidate = () => {
        if (!isActive || !current || feedback) return;

        setIsChecking(true);
        const isCorrect = items.every((item, index) => item === current.steps[index]);

        if (isCorrect) {
            setFeedback('success');
            onScore(level * 50);
            setTimeout(() => {
                setLevel(l => l + 1);
                next();
            }, 1200);
        } else {
            setFeedback('error');
            setTimeout(() => {
                setFeedback(null);
                setIsChecking(false);
                // We keep the current order so user can fix it
            }, 1500);
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
            <AnimatePresence>
                {feedback === 'success' && (
                    <div key="success-overlay" className="scaleIn" style={{
                        position: 'absolute',
                        zIndex: 100,
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
                    <div key="error-overlay" className="shake" style={{
                        position: 'absolute',
                        zIndex: 100,
                        fontSize: '10rem',
                        color: 'var(--red)',
                        pointerEvents: 'none',
                        opacity: 0.8,
                        filter: 'drop-shadow(0 0 20px rgba(211, 47, 47, 0.4))'
                    }}>
                        ✗
                    </div>
                )}
            </AnimatePresence>

            <div style={{ width: '100%', maxWidth: 640 }}>
                <p style={{
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    marginBottom: 8,
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
                            padding: '20px 32px',
                            marginBottom: 32,
                            border: 'none',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}>
                            <h2 style={{ fontSize: '1.4rem', color: 'var(--cyan)', fontWeight: 800 }}>
                                {current.event}
                            </h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                Ordonnez les étapes de la cause vers la conséquence
                            </p>
                        </Card>

                        {/* Drag & Drop Area */}
                        <Reorder.Group
                            axis="y"
                            values={items}
                            onReorder={setItems}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                marginBottom: 40,
                                width: '100%',
                                padding: 0,
                                listStyle: 'none'
                            }}
                        >
                            {items.map((item, index) => (
                                <Reorder.Item
                                    key={item}
                                    value={item}
                                    style={{
                                        height: 60,
                                        background: 'white',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0 20px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                        cursor: 'grab',
                                        userSelect: 'none'
                                    }}
                                    whileDrag={{
                                        scale: 1.02,
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        cursor: 'grabbing',
                                        zIndex: 50
                                    }}
                                >
                                    <div style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background: 'var(--bg-card)',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.7rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 16,
                                        fontWeight: 800,
                                        fontFamily: 'var(--font-mono)',
                                        border: '1px solid rgba(0,0,0,0.05)'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <span style={{
                                        color: 'var(--text-primary)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem'
                                    }}>
                                        {item}
                                    </span>
                                    <div style={{ marginLeft: 'auto', opacity: 0.2 }}>
                                        ☰
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        {/* Validation Button */}
                        <div style={{ textAlign: 'center' }}>
                            <button
                                className="btn"
                                onClick={handleValidate}
                                disabled={!!feedback || isChecking}
                                style={{
                                    height: 56,
                                    width: 200,
                                    borderRadius: 'var(--radius-lg)',
                                    border: 'none',
                                    color: 'white',
                                    background: 'var(--cyan)',
                                    fontSize: '1rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.1em',
                                    boxShadow: feedback || isChecking ? 'none' : '0 6px 0 #00cca3, 0 10px 20px rgba(0,255,213,0.2)',
                                    transform: feedback || isChecking ? 'translateY(4px)' : 'none',
                                    transition: 'all 0.1s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                {isChecking ? 'VÉRIFICATION...' : 'VALIDER'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CausalGame;
