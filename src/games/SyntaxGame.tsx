import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { SYNTAX_DATA } from '../data/gameData';
import { pick, shuffle } from '../utils/helpers';
import { SyntaxData } from '../types';

interface SyntaxGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const SyntaxGame: React.FC<SyntaxGameProps> = ({ onBack, onScore, isActive }) => {
    const [current, setCurrent] = useState<SyntaxData | null>(null);
    const [shuffledFragments, setShuffledFragments] = useState<{ text: string; originalIdx: number }[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 6;

    const next = useCallback(() => {
        if (!isActive) return;
        const avail = SYNTAX_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            const idx = 0;
            const item = SYNTAX_DATA[idx];
            setCurrent(item);
            setShuffledFragments(
                shuffle(item.fragments.map((text, originalIdx) => ({ text, originalIdx })))
            );
            setSelected([]);
            return;
        }
        const idx = pick(avail);
        setUsed((p: number[]) => [...p, idx]);
        const item = SYNTAX_DATA[idx];
        setCurrent(item);
        setShuffledFragments(
            shuffle(item.fragments.map((text, originalIdx) => ({ text, originalIdx })))
        );
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
            setShuffledFragments([]);
            setSelected([]);
            setFeedback(null);
        }
    }, [isActive, next]);

    const handleFragmentClick = (originalIdx: number) => {
        if (!isActive || feedback) return;
        if (selected.includes(originalIdx)) {
            setSelected(selected.filter((i) => i !== originalIdx));
        } else {
            setSelected([...selected, originalIdx]);
        }
    };

    const validateSentence = () => {
        if (!isActive || !current) return;
        const isCorrect = selected.every((idx, i) => idx === current.correct[i]) &&
            selected.length === current.correct.length;

        if (isCorrect) {
            setFeedback('success');
            onScore(40);
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
                        <Card>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>
                                Phrase en construction :
                            </p>
                            <div
                                style={{
                                    minHeight: 60,
                                    padding: 16,
                                    background: 'var(--bg-elevated)',
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 8,
                                }}
                            >
                                {selected.map((idx, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            padding: '6px 12px',
                                            background: 'var(--cyan)',
                                            color: 'var(--bg-deep)',
                                            borderRadius: 'var(--radius-sm)',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {current.fragments[idx]}
                                    </span>
                                ))}
                                {selected.length === 0 && (
                                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                        Clique sur les fragments dans l'ordre...
                                    </span>
                                )}
                            </div>
                        </Card>

                        <div style={{ marginTop: 24 }}>
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 16 }}>
                                Cliquez dans le bon ordre :
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                                {shuffledFragments.map((frag) => (
                                    <button
                                        key={frag.originalIdx}
                                        className={`btn ${selected.includes(frag.originalIdx)
                                            ? 'btn-primary'
                                            : 'btn-secondary'
                                            }`}
                                        onClick={() => handleFragmentClick(frag.originalIdx)}
                                        disabled={!!feedback || selected.includes(frag.originalIdx)}
                                        style={{ padding: '10px 16px' }}
                                    >
                                        {frag.text}
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
                                onClick={validateSentence}
                                disabled={!!feedback || selected.length !== current.fragments.length}
                            >
                                Valider
                            </button>
                        </div>

                        {feedback && (
                            <Feedback
                                type={feedback}
                                message={feedback === 'success' ? 'Parfait !' : 'Mauvais ordre !'}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SyntaxGame;
