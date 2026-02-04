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
}

const HumanAiGame: React.FC<HumanAiGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'playing' | 'result'>('playing');
    const [current, setCurrent] = useState<HumanAiData | null>(null);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 6;

    const next = useCallback(() => {
        const avail = HUMAN_AI_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            setCurrent(HUMAN_AI_DATA[0]);
        } else {
            const idx = pick(avail);
            setUsed((p) => [...p, idx]);
            setCurrent(HUMAN_AI_DATA[idx]);
        }
        setFeedback(null);
    }, [used]);

    useEffect(() => {
        next();
    }, [next]);

    const handleAnswer = (author: 'human' | 'ai') => {
        if (!current) return;
        const correct = author === current.author;
        if (correct) {
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

    if (phase === 'result')
        return (
            <ResultScreen
                score={score}
                maxScore={maxRounds * 40}
                stats={{ Identifiés: `${round}/${maxRounds}` }}
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

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header
                title="Humain ou IA ?"
                subtitle="Identifie l'origine du texte"
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(round / maxRounds) * 100}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                {current && (
                    <>
                        <Card style={{ marginBottom: 40, borderLeft: `4px solid var(--cyan)` }}>
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>"{current.text}"</p>
                        </Card>
                        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
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
        </div>
    );
};

export default HumanAiGame;
