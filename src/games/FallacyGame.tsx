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
    onScore: (score: number) => void;
    isActive: boolean;
}

const FallacyGame: React.FC<FallacyGameProps> = ({ onBack, onScore, isActive }) => {
    const [current, setCurrent] = useState<FallacyData | null>(null);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const maxRounds = 6;

    const next = useCallback(() => {
        if (!isActive) return;
        setCurrent(FALLACY_DATA[round % FALLACY_DATA.length]);
        setSelected(null);
        setFeedback(null);
    }, [round, isActive]);

    useEffect(() => {
        if (isActive) {
            next();
        } else {
            setRound(0);
            setLives(3);
            setCurrent(null);
            setSelected(null);
            setFeedback(null);
        }
    }, [isActive, next]);

    const handleAnswer = (ans: string) => {
        if (!isActive || !current || feedback) return;
        setSelected(ans);
        const correct = ans === current.fallacy;
        if (correct) {
            setFeedback('success');
            onScore(35);
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            {current && (
                <>
                    <Card style={{ width: '100%', maxWidth: 600 }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                            "{current.text}"
                        </p>
                    </Card>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: '20px 0 12px' }}>
                        Quel sophisme est utilisé ?
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 500 }}>
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
    );
};

export default FallacyGame;
