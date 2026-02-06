import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import OptionBtn from '../components/OptionBtn';
import Feedback from '../components/Feedback';
import { TRILEMMA_DATA } from '../data/gameData';
import { TrilemmaData } from '../types';

interface TrilemmaGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const TrilemmaGame: React.FC<TrilemmaGameProps> = ({ onBack, onScore, isActive }) => {
    const [current, setCurrent] = useState<TrilemmaData | null>(null);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const maxRounds = 8;

    const next = useCallback(() => {
        if (!isActive) return;
        setCurrent(TRILEMMA_DATA[round % TRILEMMA_DATA.length]);
        setFeedback(null);
    }, [round, isActive]);

    useEffect(() => {
        if (isActive) {
            next();
        } else {
            setRound(0);
            setLives(3);
            setCurrent(null);
            setFeedback(null);
        }
    }, [isActive, next]);

    const handleAnswer = (ans: 'true' | 'false' | 'unknown') => {
        if (!isActive || !current || feedback) return;
        const correct = ans === current.answer;
        if (correct) {
            setFeedback('success');
            onScore(25);
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

    if (!isActive) return null;

    const answers = [
        { id: 'true' as const, label: 'VRAI', color: 'var(--green)', icon: '✓' },
        { id: 'false' as const, label: 'FAUX', color: 'var(--red)', icon: '✗' },
        { id: 'unknown' as const, label: 'INVÉRIFIABLE', color: 'var(--yellow)', icon: '?' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            {current && (
                <>
                    <div
                        className="glass scaleIn"
                        style={{
                            padding: 32,
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center',
                            marginBottom: 40,
                            width: '100%',
                            maxWidth: 400,
                        }}
                    >
                        <p style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.6 }}>
                            {current.statement}
                        </p>
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 12,
                            width: '100%',
                            maxWidth: 400,
                        }}
                    >
                        {answers.map((ans) => (
                            <button
                                key={ans.id}
                                onClick={() => handleAnswer(ans.id)}
                                disabled={!!feedback}
                                className="btn-option"
                                style={{
                                    height: 100,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    textAlign: 'center',
                                    padding: 0,
                                    borderColor: feedback && current.answer === ans.id ? ans.color : 'transparent',
                                    background: feedback && current.answer === ans.id ? `${ans.color}15` : 'var(--bg-card)',
                                    opacity: feedback && current.answer !== ans.id ? 0.3 : 1,
                                }}
                            >
                                <span style={{ fontSize: '1.5rem', color: ans.color }}>{ans.icon}</span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                    {ans.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </>
            )}
            {feedback && (
                <Feedback type={feedback} message={feedback === 'success' ? 'Bien vu !' : 'Erreur !'} />
            )}
        </div>
    );
};

export default TrilemmaGame;
