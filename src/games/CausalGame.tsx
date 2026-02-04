import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import OptionBtn from '../components/OptionBtn';
import Feedback from '../components/Feedback';
import { CAUSAL_DATA } from '../data/gameData';
import { CausalData } from '../types';
import { pick, shuffle } from '../utils/helpers';

interface CausalGameProps {
    onBack: () => void;
}

const CausalGame: React.FC<CausalGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'playing' | 'result'>('playing');
    const [current, setCurrent] = useState<CausalData | null>(null);
    const [userSteps, setUserSteps] = useState<string[]>([]);
    const [scrambled, setScrambled] = useState<string[]>([]);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const maxRounds = 3;

    const next = useCallback(() => {
        const data = CAUSAL_DATA[round % CAUSAL_DATA.length];
        setCurrent(data);
        setScrambled(shuffle([...data.steps]));
        setUserSteps([]);
        setFeedback(null);
    }, [round]);

    useEffect(() => {
        next();
    }, [next]);

    const handleStepClick = (step: string) => {
        if (feedback) return;
        const nextSteps = [...userSteps, step];
        setUserSteps(nextSteps);
        setScrambled(scrambled.filter((s) => s !== step));

        if (nextSteps.length === current?.steps.length) {
            const isCorrect = nextSteps.every((s, i) => s === current.steps[i]);
            if (isCorrect) {
                setFeedback('success');
                setScore((s) => s + 50);
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
                else {
                    setTimeout(() => {
                        setUserSteps([]);
                        setScrambled(shuffle([...current.steps]));
                        setFeedback(null);
                    }, 1500);
                }
            }
        }
    };

    if (phase === 'result')
        return (
            <ResultScreen
                score={score}
                maxScore={maxRounds * 50}
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
                title="Chaîne Causale"
                subtitle="Reconstruis la logique"
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(round / maxRounds) * 100}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                {current && (
                    <>
                        <h2 style={{ textAlign: 'center', marginBottom: 24, color: 'var(--cyan)' }}>
                            Événement : {current.event}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                            {userSteps.map((step, i) => (
                                <div key={i} className="glass fadeIn" style={{ padding: '12px 16px', borderLeft: '3px solid var(--purple)' }}>
                                    <span style={{ color: 'var(--text-muted)', marginRight: 12, fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
                                    {step}
                                </div>
                            ))}
                            {Array.from({ length: current.steps.length - userSteps.length }).map((_, i) => (
                                <div key={i + userSteps.length} style={{ height: 48, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }} />
                            ))}
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 12, textAlign: 'center', fontSize: '0.85rem' }}>
                                Choisis l'étape suivante :
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                                {scrambled.map((step, i) => (
                                    <OptionBtn key={i} onClick={() => handleStepClick(step)} disabled={!!feedback}>
                                        {step}
                                    </OptionBtn>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {feedback && (
                    <Feedback type={feedback} message={feedback === 'success' ? 'Parfaitement logique !' : 'Erreur de logique !'} />
                )}
            </div>
        </div>
    );
};

export default CausalGame;
