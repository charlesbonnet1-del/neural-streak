import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { UCHRONIA_DATA } from '../data/gameData';
import { pick, shuffle } from '../utils/helpers';
import { UchroniaData } from '../types';

interface UchroniaGameProps {
    onBack: () => void;
}

const UchroniaGame: React.FC<UchroniaGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'playing' | 'result'>('playing');
    const [current, setCurrent] = useState<UchroniaData | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 6;

    const next = useCallback(() => {
        const avail = UCHRONIA_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            const item = UCHRONIA_DATA[0];
            setCurrent(item);
            setOptions(shuffle([...item.consequences, item.absurd]));
            setSelectedIdx(null);
            return;
        }
        const idx = pick(avail);
        setUsed((p) => [...p, idx]);
        const item = UCHRONIA_DATA[idx];
        setCurrent(item);
        setOptions(shuffle([...item.consequences, item.absurd]));
        setSelectedIdx(null);
        setFeedback(null);
    }, [used]);

    useEffect(() => {
        next();
    }, []);

    const handleSelect = (idx: number) => {
        if (feedback || !current) return;
        setSelectedIdx(idx);
        const selectedOption = options[idx];
        const isCorrect = selectedOption === current.absurd;

        if (isCorrect) {
            setFeedback('success');
            setScore((s) => s + 40);
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
                maxScore={maxRounds * 40}
                stats={{ 'Uchronies': `${round}/${maxRounds}` }}
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
                title="Et si... ?"
                subtitle="Identifie l'absurde"
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(round / maxRounds) * 100}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                {current && (
                    <>
                        <Card style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.3rem', fontWeight: 700 }}>🌀 {current.scenario}</p>
                        </Card>

                        <p
                            style={{
                                textAlign: 'center',
                                color: 'var(--text-secondary)',
                                marginTop: 20,
                                marginBottom: 16,
                            }}
                        >
                            Quelle conséquence est ABSURDE ?
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {options.map((opt, idx) => {
                                const isAbsurd = opt === current.absurd;
                                let className = 'btn-option';
                                if (feedback && isAbsurd) className += ' correct';
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
                                        ? "Bien vu, c'était absurde !"
                                        : `L'absurde était : "${current.absurd}"`
                                }
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UchroniaGame;
