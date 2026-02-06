import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { HUMAN_AI_DATA } from '../data/gameData';
import { HumanAiData } from '../types';
import { pick } from '../utils/helpers';

interface HumanAiGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const HumanAiGame: React.FC<HumanAiGameProps> = ({ onBack, onScore, isActive }) => {
    const [current, setCurrent] = useState<HumanAiData | null>(null);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 6;

    const next = useCallback(() => {
        if (!isActive) return;
        const avail = HUMAN_AI_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            setCurrent(HUMAN_AI_DATA[0]);
        } else {
            const idx = pick(avail);
            setUsed((p: number[]) => [...p, idx]);
            setCurrent(HUMAN_AI_DATA[idx]);
        }
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
            setFeedback(null);
        }
    }, [isActive, next]);

    const handleAnswer = (author: 'human' | 'ai') => {
        if (!isActive || !current || feedback) return;
        const correct = author === current.author;
        if (correct) {
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

    if (!isActive) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            {current && (
                <>
                    <Card style={{ marginBottom: 40, borderLeft: `4px solid var(--cyan)`, width: '100%', maxWidth: 600 }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>"{current.text}"</p>
                    </Card>
                    <div style={{ marginTop: 'auto', textAlign: 'center', width: '100%' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
                            Qui a écrit ce message ?
                        </p>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleAnswer('human')}
                                disabled={!!feedback}
                                style={{ minWidth: 140 }}
                            >
                                🙋‍♂️ Humain
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleAnswer('ai')}
                                disabled={!!feedback}
                                style={{ minWidth: 140 }}
                            >
                                🤖 IA
                            </button>
                        </div>
                    </div>
                </>
            )}
            {feedback && (
                <Feedback type={feedback} message={feedback === 'success' ? 'Bien vu !' : 'Perdu !'} />
            )}
        </div>
    );
};

export default HumanAiGame;
