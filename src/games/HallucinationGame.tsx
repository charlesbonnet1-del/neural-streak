import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { HALLUCINATION_DATA } from '../data/gameData';
import { pick } from '../utils/helpers';
import { HallucinationData } from '../types';

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

        // Refill if empty
        let pool = avail;
        if (pool.length === 0) {
            setUsed([]);
            pool = HALLUCINATION_DATA.map((_, i) => i);
        }

        const idx = pick(pool);
        setUsed((p) => [...p, idx]);
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
                setLevel(l => l + 1);
                next();
            }, 1000);
        } else {
            setFeedback('error');
            setTimeout(() => {
                next();
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
                transition: 'background-color 0.3s ease'
            }}
        >
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Stat label="NIVEAU" value={level} color="var(--blue)" />
            </div>

            <div style={{ width: '100%', maxWidth: 600 }}>
                {current && (
                    <Card style={{ padding: 32, marginBottom: 40, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <p style={{
                            fontSize: '1.25rem',
                            lineHeight: 1.7,
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            fontWeight: 500
                        }}>
                            "{current.text}"
                        </p>

                        {feedback === 'error' && current.hasError && (
                            <div className="scaleIn" style={{
                                marginTop: 24,
                                padding: 16,
                                background: 'rgba(211, 47, 47, 0.05)',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: '4px solid var(--red)'
                            }}>
                                <p style={{ color: 'var(--red)', fontWeight: 600 }}>Hallucination détectée :</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{current.error}</p>
                            </div>
                        )}
                    </Card>
                )}

                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Le texte contient-il une erreur logique ?
                    </p>

                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleAnswer(false)}
                            disabled={!!feedback}
                            style={{
                                flex: 1,
                                height: 60,
                                borderRadius: 'var(--radius-lg)',
                                border: '2px solid rgba(56, 142, 60, 0.2)',
                                color: 'var(--green)',
                                background: 'white',
                                fontSize: '1.1rem'
                            }}
                        >
                            ✓ Correct
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleAnswer(true)}
                            disabled={!!feedback}
                            style={{
                                flex: 1,
                                height: 60,
                                borderRadius: 'var(--radius-lg)',
                                border: '2px solid rgba(211, 47, 47, 0.2)',
                                color: 'var(--red)',
                                background: 'white',
                                fontSize: '1.1rem'
                            }}
                        >
                            ✗ Erreur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallucinationGame;
