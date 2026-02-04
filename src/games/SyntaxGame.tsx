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
}

const SyntaxGame: React.FC<SyntaxGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'playing' | 'result'>('playing');
    const [current, setCurrent] = useState<SyntaxData | null>(null);
    const [shuffledFragments, setShuffledFragments] = useState<{ text: string; originalIdx: number }[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 6;

    const next = useCallback(() => {
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
        setUsed((p) => [...p, idx]);
        const item = SYNTAX_DATA[idx];
        setCurrent(item);
        setShuffledFragments(
            shuffle(item.fragments.map((text, originalIdx) => ({ text, originalIdx })))
        );
        setSelected([]);
        setFeedback(null);
    }, [used]);

    useEffect(() => {
        next();
    }, []);

    const handleFragmentClick = (originalIdx: number) => {
        if (feedback) return;
        if (selected.includes(originalIdx)) {
            setSelected(selected.filter((i) => i !== originalIdx));
        } else {
            setSelected([...selected, originalIdx]);
        }
    };

    const validateSentence = () => {
        if (!current) return;
        const isCorrect = selected.every((idx, i) => idx === current.correct[i]) &&
            selected.length === current.correct.length;

        if (isCorrect) {
            setFeedback('success');
            setScore((s) => s + 40);
            setTimeout(() => {
                if (round + 1 >= maxRounds) setPhase('result');
                else {
                    setRound((r) => r + 1);
                    next();
                }
            }, 1200);
        } else {
            setFeedback('error');
            setLives((l) => l - 1);
            if (lives <= 1) setTimeout(() => setPhase('result'), 1000);
            else
                setTimeout(() => {
                    setRound((r) => r + 1);
                    next();
                }, 1500);
        }
    };

    const reset = () => {
        setSelected([]);
        setFeedback(null);
    };

    if (phase === 'result') {
        return (
            <ResultScreen
                score={score}
                maxScore={maxRounds * 40}
                stats={{ 'Phrases': `${round}/${maxRounds}` }}
                onRetry={() => {
                    setRound(0);
                    setScore(0);
                    setLives(3);
                    setUsed([]);
                    next();
                    setPhase('playing');
                }}
                onBack={onBack}
            />
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header
                title="Puzzle Syntaxique"
                subtitle="Reconstruis la phrase"
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(round / maxRounds) * 100}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
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
                                Clique dans le bon ordre :
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
