import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { SEQUENCE_DATA } from '../data/gameData';
import { pick, shuffle } from '../utils/helpers';
import { SequenceData } from '../types';

interface SequencingGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const SequencingGame: React.FC<SequencingGameProps> = ({ onBack, onScore, isActive }) => {
    const [current, setCurrent] = useState<SequenceData | null>(null);
    const [shuffledSteps, setShuffledSteps] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 6;

    const next = useCallback(() => {
        if (!isActive) return;
        const avail = SEQUENCE_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            const item = SEQUENCE_DATA[0];
            setCurrent(item);
            setShuffledSteps(shuffle([...item.steps]));
            setSelected([]);
            return;
        }
        const idx = pick(avail);
        setUsed((p: number[]) => [...p, idx]);
        const item = SEQUENCE_DATA[idx];
        setCurrent(item);
        setShuffledSteps(shuffle([...item.steps]));
        setSelected([]);
        setFeedback(null);
    }, [used, isActive]);

    useEffect(() => {
        if (isActive) {
            next();
        } else {
            setRound(0);
            setLives(3);
            setUsed([]);
            setCurrent(null);
            setShuffledSteps([]);
            setSelected([]);
            setFeedback(null);
        }
    }, [isActive, next]);

    const handleStepClick = (step: string) => {
        if (!isActive || feedback) return;
        if (selected.includes(step)) return;
        setSelected([...selected, step]);
    };

    const validateSequence = () => {
        if (!isActive || !current) return;
        const isCorrect = selected.every((step, i) => step === current.steps[i]);

        if (isCorrect) {
            setFeedback('success');
            onScore(50);
            setTimeout(() => {
                setRound((r: number) => r + 1);
                if (isActive) next();
            }, 1200);
        } else {
            setFeedback('error');
            setLives((l: number) => l - 1);
            setTimeout(() => {
                setRound((r: number) => r + 1);
                if (isActive) next();
            }, 1500);
        }
    };

    const reset = () => {
        if (!isActive) return;
        setSelected([]);
        setFeedback(null);
    };

    if (!isActive) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 600 }}>
                {current && (
                    <>
                        <Card style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>📊 {current.title}</p>
                        </Card>

                        <div style={{ marginTop: 20 }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>
                                Sélection actuelle :
                            </p>
                            <div
                                style={{
                                    minHeight: 100,
                                    padding: 16,
                                    background: 'var(--bg-card)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                }}
                            >
                                {selected.map((step, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                background: 'var(--cyan)',
                                                color: 'var(--bg-deep)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            {i + 1}
                                        </span>
                                        <span>{step}</span>
                                        {i < selected.length - 1 && (
                                            <span style={{ marginLeft: 'auto', color: 'var(--cyan)' }}>→</span>
                                        )}
                                    </div>
                                ))}
                                {selected.length === 0 && (
                                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                        Clique sur les étapes dans l'ordre...
                                    </span>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>Restant :</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {shuffledSteps
                                    .filter((s) => !selected.includes(s))
                                    .map((step) => (
                                        <button
                                            key={step}
                                            className="btn-option"
                                            onClick={() => handleStepClick(step)}
                                            disabled={!!feedback}
                                        >
                                            {step}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                            <button
                                className="btn btn-secondary"
                                onClick={reset}
                                disabled={!!feedback || selected.length === 0}
                            >
                                ↺ Recommencer
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={validateSequence}
                                disabled={!!feedback || selected.length !== current.steps.length}
                            >
                                Valider
                            </button>
                        </div>

                        {feedback && (
                            <Feedback
                                type={feedback}
                                message={feedback === 'success' ? 'Ordre parfait !' : 'Mauvais ordre !'}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SequencingGame;
