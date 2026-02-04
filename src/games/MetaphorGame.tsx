import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { METAPHOR_DATA } from '../data/gameData';
import { pick } from '../utils/helpers';
import { MetaphorData } from '../types';

interface MetaphorGameProps {
    onBack: () => void;
}

const MetaphorGame: React.FC<MetaphorGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'playing' | 'result'>('playing');
    const [current, setCurrent] = useState<MetaphorData | null>(null);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 8;

    const next = useCallback(() => {
        const avail = METAPHOR_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            setCurrent(METAPHOR_DATA[0]);
            return;
        }
        const idx = pick(avail);
        setUsed((p) => [...p, idx]);
        setCurrent(METAPHOR_DATA[idx]);
        setSelectedIdx(null);
        setFeedback(null);
    }, [used]);

    useEffect(() => {
        next();
    }, []);

    const handleSelect = (idx: number) => {
        if (feedback || !current) return;
        setSelectedIdx(idx);
        const isCorrect = idx === current.best;

        if (isCorrect) {
            setFeedback('success');
            setScore((s) => s + 35);
        } else {
            setFeedback('error');
            setLives((l) => l - 1);
        }

        if (lives <= 1 && !isCorrect) {
            setTimeout(() => setPhase('result'), 1200);
        } else {
            setTimeout(() => {
                if (round + 1 >= maxRounds) setPhase('result');
                else {
                    setRound((r) => r + 1);
                    next();
                }
            }, 1200);
        }
    };

    if (phase === 'result') {
        return (
            <ResultScreen
                score={score}
                maxScore={maxRounds * 35}
                stats={{ 'Métaphores': `${round}/${maxRounds}` }}
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
                title="Métaphores"
                subtitle="Choisis la meilleure analogie"
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(round / maxRounds) * 100}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                {current && (
                    <>
                        <Card style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>
                                {current.concept}
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>c'est comme...</p>
                        </Card>

                        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {current.options.map((opt, idx) => {
                                let className = 'btn-option';
                                if (feedback && idx === current.best) className += ' correct';
                                else if (feedback && idx === selectedIdx) className += ' wrong';

                                return (
                                    <button
                                        key={idx}
                                        className={className}
                                        onClick={() => handleSelect(idx)}
                                        disabled={!!feedback}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {feedback && (
                            <Feedback
                                type={feedback}
                                message={
                                    feedback === 'success'
                                        ? 'Excellente analogie !'
                                        : `La meilleure : "${current.options[current.best]}"`
                                }
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MetaphorGame;
