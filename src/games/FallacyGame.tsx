import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import OptionBtn from '../components/OptionBtn';
import Feedback from '../components/Feedback';
import { FALLACY_DATA } from '../data/gameData';
import { FallacyData } from '../types';

interface FallacyGameProps {
    onBack: () => void;
}

const FallacyGame: React.FC<FallacyGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'playing' | 'result'>('playing');
    const [current, setCurrent] = useState<FallacyData | null>(null);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const maxRounds = 6;

    const next = useCallback(() => {
        setCurrent(FALLACY_DATA[round % FALLACY_DATA.length]);
        setSelected(null);
        setFeedback(null);
    }, [round]);

    useEffect(() => {
        next();
    }, [next]);

    const handleAnswer = (ans: string) => {
        if (!current) return;
        setSelected(ans);
        const correct = ans === current.fallacy;
        if (correct) {
            setFeedback('success');
            setScore((s) => s + 35);
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

    if (phase === 'result')
        return (
            <ResultScreen
                score={score}
                maxScore={maxRounds * 35}
                stats={{ Identifiés: `${round}/${maxRounds}` }}
                onRetry={() => {
                    setRound(0);
                    setScore(0);
                    setLives(3);
                    next();
                    setPhase('playing');
                }}
                onBack={onBack}
            />
        );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header
                title="Bullshit Detector"
                subtitle="Identifie le sophisme"
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(round / maxRounds) * 100}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                {current && (
                    <>
                        <Card>
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                                "{current.text}"
                            </p>
                        </Card>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: '20px 0 12px' }}>
                            Quel sophisme est utilisé ?
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 20px' }}>
                            {current.options.map((opt, i) => (
                                <OptionBtn
                                    key={i}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={!!feedback}
                                    correct={feedback && opt === current.fallacy}
                                    wrong={feedback === 'error' && selected === opt && opt !== current.fallacy}
                                >
                                    {opt}
                                </OptionBtn>
                            ))}
                        </div>
                    </>
                )}
                {feedback && (
                    <Feedback
                        type={feedback}
                        message={feedback === 'success' ? 'Exact !' : `C'était : ${current?.fallacy}`}
                    />
                )}
            </div>
        </div>
    );
};

export default FallacyGame;
