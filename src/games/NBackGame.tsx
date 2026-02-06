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

    const seqLen = 100; // Enough for 1 minute

    const nextCard = useCallback((currentN: number) => {
        setSequence((prev) => {
            const nextSeq = [...prev];
            // 35% chance of a match for N-back
            if (nextSeq.length >= currentN && Math.random() < 0.35) {
                nextSeq.push(nextSeq[nextSeq.length - currentN]);
            } else {
                nextSeq.push(pick(COLORS));
            }
            return nextSeq;
        });
        setIdx((i) => i + 1);
    }, []);

    useEffect(() => {
        if (isActive) {
            const firstColor = pick(COLORS);
            setSequence([firstColor]);
            setIdx(0);
            setN(1);
            setStreak(0);
        }
    }, [isActive]);

    const handleResponse = useCallback((userMatch: boolean) => {
        if (!isActive || feedback || idx < n) return;

        const isMatch = sequence[idx] === sequence[idx - n];
        const correct = userMatch === isMatch;

        // Calculate next N and streak synchronously to avoid race conditions
        let nextN = n;
        let nextStreak = streak;

        if (correct) {
            onScore(10 * n);
            setFeedback('success');
            nextStreak = streak > 0 ? streak + 1 : 1;
        } else {
            setFeedback('error');
            nextStreak = streak < 0 ? streak - 1 : -1;
        }

        if (nextStreak >= 3) {
            nextN = n + 1;
            nextStreak = 0;
        } else if (nextStreak <= -2 && n > 1) {
            nextN = n - 1;
            nextStreak = 0;
        }

        setN(nextN);
        setStreak(nextStreak);

        setTimeout(() => {
            setFeedback(null);
            nextCard(nextN);
        }, 600);
    }, [isActive, feedback, idx, n, sequence, streak, onScore, nextCard]);

    useEffect(() => {
        if (isActive && !feedback) {
            const delay = idx < n ? 1500 : 3000; // Slightly more time for trials
            const t = setTimeout(() => {
                // If the user didn't respond to a non-match, we move to next card automaticaly
                // If it was a match and they missed it, it's an error
                if (idx >= n) {
                    const isMatch = sequence[idx] === sequence[idx - n];
                    if (isMatch) {
                        handleResponse(false); // Implicitly "false" (error) if they timed out on a match
                    } else {
                        nextCard(n);
                    }
                } else {
                    nextCard(n);
                }
            }, delay);
            return () => clearTimeout(t);
        }
    }, [isActive, idx, sequence, n, feedback, nextCard, handleResponse]);

    if (!isActive) return null;

    const flashClass = feedback === 'success' ? 'flash-success' : feedback === 'error' ? 'flash-error' : '';
    const currentColor = (sequence[idx] || COLORS[0]) as Color;

    return (
        <div
            className={`fadeIn ${flashClass}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                transition: 'background-color 0.2s ease',
                backgroundColor: feedback === 'success' ? 'rgba(56, 142, 60, 0.05)' : feedback === 'error' ? 'rgba(211, 47, 47, 0.05)' : 'transparent'
            }}
        >
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Stat label="N-BACK" value={n} color="var(--blue)" />
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                {idx < n ? `Mémorise... (${n - idx} restants)` : `C'est celle d'il y a ${n} tour${n > 1 ? 's' : ''} ?`}
            </p>

            <div className="perspective" style={{ marginBottom: 40 }}>
                <div
                    key={idx} // Triggers re-animation
                    className="flip-card card-surface"
                    style={{
                        background: COLOR_HEX[currentColor],
                        boxShadow: `0 10px 30px -10px ${COLOR_HEX[currentColor]}88`,
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: 16, visibility: idx >= n ? 'visible' : 'hidden' }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => handleResponse(false)}
                    disabled={!!feedback}
                    style={{ minWidth: 120, background: 'white', border: '1px solid #e2e8f0' }}
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
