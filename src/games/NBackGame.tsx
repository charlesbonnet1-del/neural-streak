import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Stat from '../components/Stat';
import { COLORS, COLOR_HEX } from '../data/gameData';
import { pick } from '../utils/helpers';
import { Color } from '../types';

interface NBackGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const NBackGame: React.FC<NBackGameProps> = ({ onScore, isActive }) => {
    const [n, setN] = useState(1);
    const [sequence, setSequence] = useState<Color[]>([]);
    const [idx, setIdx] = useState(0);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [streak, setStreak] = useState(0); // Positive for correct, negative for errors

    const seqLen = 60; // Enough for 1 minute

    const nextCard = useCallback(() => {
        setSequence((prev) => {
            const nextSeq = [...prev];
            // 30% chance of a match for N-back
            if (nextSeq.length >= n && Math.random() < 0.3) {
                nextSeq.push(nextSeq[nextSeq.length - n]);
            } else {
                nextSeq.push(pick(COLORS));
            }
            return nextSeq;
        });
        setIdx((i) => i + 1);
    }, [n]);

    useEffect(() => {
        if (isActive) {
            const firstColor = pick(COLORS);
            setSequence([firstColor]);
            setIdx(0);
            setN(1);
            setStreak(0);
        }
    }, [isActive]);

    useEffect(() => {
        if (isActive && !feedback) {
            const delay = idx < n ? 1500 : 2500;
            const t = setTimeout(() => {
                // If the user didn't respond to a non-match, we move to next card automaticaly
                // If it was a match and they missed it, it's an error
                if (idx >= n) {
                    const isMatch = sequence[idx] === sequence[idx - n];
                    if (isMatch) {
                        handleResponse(false); // Implicitly "false" (error) if they timed out on a match
                    } else {
                        nextCard();
                    }
                } else {
                    nextCard();
                }
            }, delay);
            return () => clearTimeout(t);
        }
    }, [isActive, idx, sequence, n, feedback, nextCard]);

    const handleResponse = (userMatch: boolean) => {
        if (!isActive || feedback || idx < n) return;

        const isMatch = sequence[idx] === sequence[idx - n];
        const correct = userMatch === isMatch;

        if (correct) {
            onScore(10 * n);
            setFeedback('success');
            setStreak((s) => (s > 0 ? s + 1 : 1));
        } else {
            setFeedback('error');
            setStreak((s) => (s < 0 ? s - 1 : -1));
        }

        // Adaptive logic
        setTimeout(() => {
            setFeedback(null);
            nextCard();
        }, 600);
    };

    // Update N based on streak
    useEffect(() => {
        if (streak >= 3) {
            setN((prev) => prev + 1);
            setStreak(0);
        } else if (streak <= -2 && n > 1) {
            setN((prev) => prev - 1);
            setStreak(0);
        }
    }, [streak, n]);

    if (!isActive) return null;

    const flashClass = feedback === 'success' ? 'flash-success' : feedback === 'error' ? 'flash-error' : '';
    const currentColor = sequence[idx] || COLORS[0];

    return (
        <div
            className={flashClass}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                transition: 'background-color 0.3s ease'
            }}
        >
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Stat label="N-BACK" value={n} color="var(--blue)" />
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                {idx < n ? `Mémorise... (${n - idx} restants)` : `Est-ce la même qu'il y a ${n} tour${n > 1 ? 's' : ''} ?`}
            </p>

            <div className="perspective" style={{ marginBottom: 40 }}>
                <div
                    key={idx} // Triggers re-animation
                    className="flip-card card-surface"
                    style={{
                        background: COLOR_HEX[currentColor],
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: 16, visibility: idx >= n ? 'visible' : 'hidden' }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => handleResponse(false)}
                    disabled={!!feedback}
                    style={{ minWidth: 120, border: '1px solid #e2e8f0' }}
                >
                    Différent
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => handleResponse(true)}
                    disabled={!!feedback}
                    style={{ minWidth: 120, background: 'var(--text-primary)' }}
                >
                    MATCH !
                </button>
            </div>
        </div>
    );
};

export default NBackGame;
