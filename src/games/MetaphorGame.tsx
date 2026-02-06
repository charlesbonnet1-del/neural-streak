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
    onScore: (score: number) => void;
    isActive: boolean;
}

const MetaphorGame: React.FC<MetaphorGameProps> = ({ onBack, onScore, isActive }) => {
    const [current, setCurrent] = useState<MetaphorData | null>(null);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 8;

    const next = useCallback(() => {
        if (!isActive) return;
        const avail = METAPHOR_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            setCurrent(METAPHOR_DATA[0]);
            return;
        }
        const idx = pick(avail);
        setUsed((p: number[]) => [...p, idx]);
        setCurrent(METAPHOR_DATA[idx]);
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
            setSelectedIdx(null);
        }
    }, [isActive, next]);

    const handleSelect = (idx: number) => {
        if (!isActive || feedback || !current) return;
        setSelectedIdx(idx);
        const isCorrect = idx === current.best;

        if (isCorrect) {
            setFeedback('success');
            onScore(35);
        } else {
            setFeedback('error');
            setLives((l: number) => l - 1);
        }

        setTimeout(() => {
            setRound((r: number) => r + 1);
            if (isActive) next();
        }, 1200);
    };

    if (!isActive) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            {current && (
                <>
                    <Card style={{ textAlign: 'center', width: '100%', maxWidth: 500 }}>
                        <p style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>
                            {current.concept}
                        </p>
                        <p style={{ color: 'var(--text-secondary)' }}>c'est comme...</p>
                    </Card>

                    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 500 }}>
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
    );
};

export default MetaphorGame;
