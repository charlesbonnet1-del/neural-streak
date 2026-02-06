import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { CLICHE_DATA } from '../data/gameData';
import { pick } from '../utils/helpers';
import { ClicheData } from '../types';

interface ClicheGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const ClicheGame: React.FC<ClicheGameProps> = ({ onBack, onScore, isActive }) => {
    const [current, setCurrent] = useState<ClicheData | null>(null);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 8;

    const next = useCallback(() => {
        if (!isActive) return;
        const avail = CLICHE_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            setCurrent(CLICHE_DATA[0]);
            return;
        }
        const idx = pick(avail);
        setUsed((p: number[]) => [...p, idx]);
        setCurrent(CLICHE_DATA[idx]);
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
        }
    }, [isActive, next]);

    const handleAnswer = (hasCliche: boolean) => {
        if (!isActive || !current) return;
        const correct = hasCliche === current.hasCliche;

        if (correct) {
            setFeedback('success');
            onScore(30);
            setTimeout(() => {
                setRound((r: number) => r + 1);
                if (isActive) next();
            }, 1000);
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
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>"{current.text}"</p>
                        {feedback === 'error' && current.hasCliche && current.cliches && (
                            <div
                                style={{
                                    marginTop: 12,
                                    padding: 10,
                                    background: 'rgba(239,68,68,0.1)',
                                    borderRadius: 8,
                                    borderLeft: '3px solid var(--red)',
                                }}
                            >
                                <p style={{ color: 'var(--red)', fontSize: '0.9rem' }}>
                                    ❌ Clichés : {current.cliches.join(', ')}
                                </p>
                            </div>
                        )}
                        {feedback === 'success' && current.hasCliche && current.cliches && (
                            <div
                                style={{
                                    marginTop: 12,
                                    padding: 10,
                                    background: 'rgba(34,197,94,0.1)',
                                    borderRadius: 8,
                                    borderLeft: '3px solid var(--green)',
                                }}
                            >
                                <p style={{ color: 'var(--green)', fontSize: '0.9rem' }}>
                                    ✓ Bien vu : {current.cliches.join(', ')}
                                </p>
                            </div>
                        )}
                        {feedback === 'success' && !current.hasCliche && (
                            <div
                                style={{
                                    marginTop: 12,
                                    padding: 10,
                                    background: 'rgba(34,197,94,0.1)',
                                    borderRadius: 8,
                                    borderLeft: '3px solid var(--green)',
                                }}
                            >
                                <p style={{ color: 'var(--green)', fontSize: '0.9rem' }}>
                                    ✓ Texte authentique !
                                </p>
                            </div>
                        )}
                    </Card>

                    <div style={{ marginTop: 32, padding: '20px 0', width: '100%' }}>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 12 }}>
                            Ce texte contient-il des clichés IA ?
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
                                ✓ Authentique
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
                                ✗ Cliché IA
                            </button>
                        </div>
                    </div>
                </>
            )}
            {feedback && (
                <Feedback type={feedback} message={feedback === 'success' ? 'Correct !' : 'Incorrect !'} />
            )}
        </div>
    );
};

export default ClicheGame;
