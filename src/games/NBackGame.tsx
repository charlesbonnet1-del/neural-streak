import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Stat from '../components/Stat';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { COLORS, COLOR_HEX } from '../data/gameData';
import { pick } from '../utils/helpers';
import { Color } from '../types';

interface NBackGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const NBackGame: React.FC<NBackGameProps> = ({ onBack, onScore, isActive }) => {
    const [n, setN] = useState(1);
    const [sequence, setSequence] = useState<Color[]>([]);
    const [idx, setIdx] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [stats, setStats] = useState({ correct: 0, total: 0 });
    const seqLen = 30; // Increased to allow more trials in 1 min

    const genSeq = useCallback(() => {
        const seq: Color[] = [];
        for (let i = 0; i < seqLen; i++) {
            if (i >= n && Math.random() < 0.3) seq.push(seq[i - n]);
            else seq.push(pick(COLORS));
        }
        return seq;
    }, [n, seqLen]);

    useEffect(() => {
        if (isActive) {
            setSequence(genSeq());
            setIdx(0);
            setLives(3);
            setStats({ correct: 0, total: 0 });
        }
    }, [isActive, genSeq]);

    useEffect(() => {
        if (isActive && idx < seqLen) {
            const t = setTimeout(() => {
                if (idx >= n && sequence[idx] !== sequence[idx - n]) {
                    setIdx((i) => i + 1);
                } else if (idx < n) {
                    setIdx((i) => i + 1);
                }
            }, 2500);
            return () => clearTimeout(t);
        }
    }, [isActive, idx, sequence, n, seqLen]);

    const handleResponse = (isMatch: boolean) => {
        if (!isActive) return;
        const actual = sequence[idx] === sequence[idx - n];
        const correct = isMatch === actual;
        setStats((s: { correct: number; total: number }) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
        if (correct) {
            onScore(10 * n);
            setFeedback('success');
        } else {
            setLives((l: number) => l - 1);
            setFeedback('error');
        }
        setTimeout(() => {
            setFeedback(null);
            setIdx((i: number) => i + 1);
        }, 500);
    };

    if (!isActive) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Stat label="N" value={n} color="var(--cyan)" />
            </div>

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
    );
};

export default NBackGame;
