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
    onScore: (score: number) => void;
    isActive: boolean;
}

const UchroniaGame: React.FC<UchroniaGameProps> = ({ onBack, onScore, isActive }) => {
    const [current, setCurrent] = useState<UchroniaData | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 6;

    const next = useCallback(() => {
        if (!isActive) return;
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
        setUsed((p: number[]) => [...p, idx]);
        const item = UCHRONIA_DATA[idx];
        setCurrent(item);
        setOptions(shuffle([...item.consequences, item.absurd]));
        setSelectedIdx(null);
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
            setOptions([]);
            setSelectedIdx(null);
            setFeedback(null);
        }
    }, [isActive, next]);

    const handleSelect = (idx: number) => {
        if (!isActive || feedback || !current) return;
        setSelectedIdx(idx);
        const selectedOption = options[idx];
        const isCorrect = selectedOption === current.absurd;

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
            }, 1200);
        }
    };

    if (!isActive) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 600 }}>
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
