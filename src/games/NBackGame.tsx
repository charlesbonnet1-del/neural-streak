import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { COLORS, COLOR_HEX } from '../data/gameData';
import { pick } from '../utils/helpers';
import { Color } from '../types';

interface NBackGameProps {
    onBack: () => void;
}

const NBackGame: React.FC<NBackGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
    const [n, setN] = useState(1);
    const [sequence, setSequence] = useState<Color[]>([]);
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [stats, setStats] = useState({ correct: 0, total: 0 });
    const seqLen = 15;

    const genSeq = useCallback(() => {
        const seq: Color[] = [];
        for (let i = 0; i < seqLen; i++) {
            if (i >= n && Math.random() < 0.3) seq.push(seq[i - n]);
            else seq.push(pick(COLORS));
        }
        return seq;
    }, [n]);

    const start = () => {
        setSequence(genSeq());
        setIdx(0);
        setPhase('playing');
        setFeedback(null);
    };

    useEffect(() => {
        if (phase === 'playing' && idx < seqLen) {
            const t = setTimeout(() => {
                if (idx >= n && sequence[idx] !== sequence[idx - n]) setIdx((i) => i + 1);
                else if (idx < n) setIdx((i) => i + 1);
            }, 2500);
            return () => clearTimeout(t);
        } else if (phase === 'playing' && idx >= seqLen) {
            setPhase('result');
        }
    }, [phase, idx, sequence, n, seqLen]);

    const handleResponse = (isMatch: boolean) => {
        const actual = sequence[idx] === sequence[idx - n];
        const correct = isMatch === actual;
        setStats((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
        if (correct) {
            setScore((s) => s + 10 * n);
            setFeedback('success');
        } else {
            setLives((l) => l - 1);
            setFeedback('error');
            if (lives <= 1) {
                setTimeout(() => setPhase('result'), 500);
                return;
            }
        }
        setTimeout(() => {
            setFeedback(null);
            setIdx((i) => i + 1);
        }, 500);
    };

    if (phase === 'result')
        return (
            <ResultScreen
                score={score}
                level={n}
                stats={{
                    Précision: `${stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%`,
                }}
                onRetry={() => {
                    setScore(0);
                    setLives(3);
                    setStats({ correct: 0, total: 0 });
                    setPhase('intro');
                }}
                onBack={onBack}
            />
        );

    if (phase === 'intro')
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header title="N-Back Adaptatif" onBack={onBack} />
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                    }}
                >
                    <Card style={{ textAlign: 'center', maxWidth: 400 }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔄</div>
                        <h2 style={{ marginBottom: 12 }}>N = {n}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                            Appuie sur <strong style={{ color: 'var(--cyan)' }}>MATCH</strong> si la couleur est
                            identique à celle d'il y a{' '}
                            <strong style={{ color: 'var(--yellow)' }}>
                                {n} étape{n > 1 ? 's' : ''}
                            </strong>
                            .
                        </p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
                            {[1, 2, 3].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setN(l)}
                                    className={`btn ${n === l ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ padding: '10px 20px' }}
                                >
                                    N={l}
                                </button>
                            ))}
                        </div>
                    </Card>
                    <button className="btn btn-primary" onClick={start} style={{ marginTop: 24 }}>
                        Commencer
                    </button>
                </div>
            </div>
        );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header
                title={`N-Back (N=${n})`}
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(idx / seqLen) * 100}
            />
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                }}
            >
                <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
                    {idx + 1} / {seqLen}
                </p>
                <div
                    className={feedback === 'error' ? 'shake' : feedback === 'success' ? 'pulse' : ''}
                    style={{
                        width: 140,
                        height: 140,
                        borderRadius: 'var(--radius-lg)',
                        background: COLOR_HEX[sequence[idx]],
                        boxShadow: `0 0 50px ${COLOR_HEX[sequence[idx]]}66`,
                        marginBottom: 32,
                        transition: 'all 0.3s ease',
                    }}
                />
                {idx >= n ? (
                    <div style={{ display: 'flex', gap: 16 }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleResponse(false)}
                            style={{ minWidth: 110 }}
                        >
                            Différent
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleResponse(true)}
                            style={{ minWidth: 110 }}
                        >
                            MATCH !
                        </button>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>Mémorise... ({n - idx} de plus)</p>
                )}
            </div>
        </div>
    );
};

export default NBackGame;
