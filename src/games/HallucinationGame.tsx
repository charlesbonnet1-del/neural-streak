import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { HALLUCINATION_DATA } from '../data/gameData';
import { pick } from '../utils/helpers';
import { HallucinationData } from '../types';

interface HallucinationGameProps {
    onBack: () => void;
}

const HallucinationGame: React.FC<HallucinationGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'playing' | 'result'>('playing');
    const [current, setCurrent] = useState<HallucinationData | null>(null);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 8;

    const next = useCallback(() => {
        const avail = HALLUCINATION_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            setCurrent(HALLUCINATION_DATA[0]);
            return;
        }
        const idx = pick(avail);
        setUsed((p) => [...p, idx]);
        setCurrent(HALLUCINATION_DATA[idx]);
        setFeedback(null);
    }, [used]);

    useEffect(() => {
        next();
    }, [next]);

    const handleAnswer = (hasErr: boolean) => {
        if (!current) return;
        const correct = hasErr === current.hasError;
        if (correct) {
            setFeedback('success');
            setScore((s) => s + 30);
            setTimeout(() => {
                if (round + 1 >= maxRounds) setPhase('result');
                else {
                    setRound((r) => r + 1);
                    next();
                }
            }, 1500);
        } else {
            setFeedback('error');
            setLives((l) => l - 1);
            if (lives <= 1) setTimeout(() => setPhase('result'), 1000);
            else
                setTimeout(() => {
                    setRound((r) => r + 1);
                    next();
                }, 2000);
        }
    };

    if (phase === 'result')
        return (
            <ResultScreen
                score={score}
                maxScore={maxRounds * 30}
                stats={{ Détectées: `${round}/${maxRounds}` }}
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
                title="Spot the Hallucination"
                subtitle="Détecte les erreurs de l'IA"
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(round / maxRounds) * 100}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                {current && (
                    <Card>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>{current.text}</p>
                        {feedback === 'error' && current.hasError && (
                            <div
                                style={{
                                    marginTop: 12,
                                    padding: 10,
                                    background: 'rgba(239,68,68,0.1)',
                                    borderRadius: 8,
                                    borderLeft: '3px solid var(--red)',
                                }}
                            >
                                <p style={{ color: 'var(--red)', fontSize: '0.9rem' }}>❌ {current.error}</p>
                            </div>
                        )}
                        {feedback === 'success' && !current.hasError && (
                            <div
                                style={{
                                    marginTop: 12,
                                    padding: 10,
                                    background: 'rgba(34,197,94,0.1)',
                                    borderRadius: 8,
                                    borderLeft: '3px solid var(--green)',
                                }}
                            >
                                <p style={{ color: 'var(--green)', fontSize: '0.9rem' }}>✓ Pas d'erreur factuelle</p>
                            </div>
                        )}
                    </Card>
                )}
                <div style={{ marginTop: 'auto', padding: '20px 0' }}>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 12 }}>
                        Ce texte contient-il une erreur ?
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleAnswer(false)}
                            disabled={!!feedback}
                            style={{
                                minWidth: 130,
                                background: 'rgba(34,197,94,0.1)',
                                borderColor: 'var(--green)',
                                color: 'var(--green)',
                            }}
                        >
                            ✓ Correct
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleAnswer(true)}
                            disabled={!!feedback}
                            style={{
                                minWidth: 130,
                                background: 'rgba(239,68,68,0.1)',
                                borderColor: 'var(--red)',
                                color: 'var(--red)',
                            }}
                        >
                            ✗ Erreur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallucinationGame;
