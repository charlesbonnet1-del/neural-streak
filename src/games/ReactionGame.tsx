import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import { COLOR_HEX } from '../data/gameData';

interface ReactionGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

type StimulusColor = 'green' | 'red' | 'yellow' | 'blue';

const ReactionGame: React.FC<ReactionGameProps> = ({ onBack, onScore, isActive }) => {
    const [currentColor, setCurrentColor] = useState<StimulusColor | null>(null);
    const [showStimulus, setShowStimulus] = useState(false);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [hits, setHits] = useState(0);
    const [misses, setMisses] = useState(0);
    const [falseAlarms, setFalseAlarms] = useState(0);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'hit' | 'miss' | 'false' | null>(null);
    const showTimeRef = useRef<number>(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const maxRounds = 20;

    const TARGET_COLOR: StimulusColor = 'green';
    const DISTRACTOR_COLORS: StimulusColor[] = ['red', 'yellow', 'blue'];
    const STIMULUS_DURATION = 1500;
    const TARGET_RATIO = 0.7;

    const nextStimulus = useCallback(() => {
        if (!isActive) return;

        const isTarget = Math.random() < TARGET_RATIO;
        const color = isTarget
            ? TARGET_COLOR
            : DISTRACTOR_COLORS[Math.floor(Math.random() * DISTRACTOR_COLORS.length)];

        setCurrentColor(color);
        setShowStimulus(true);
        setFeedback(null);
        showTimeRef.current = Date.now();

        // Auto-advance if no response
        timeoutRef.current = setTimeout(() => {
            if (color === TARGET_COLOR) {
                // Miss - should have tapped
                setMisses((m: number) => m + 1);
                setLives((l: number) => l - 1);
                setFeedback('miss');
            }
            setShowStimulus(false);
            setTimeout(() => {
                setRound((r: number) => r + 1);
            }, 500);
        }, STIMULUS_DURATION);
    }, [round, isActive]);

    useEffect(() => {
        if (isActive && !showStimulus && feedback === null) {
            const delay = 500 + Math.random() * 1000;
            const timer = setTimeout(nextStimulus, delay);
            return () => clearTimeout(timer);
        }
    }, [isActive, showStimulus, feedback, nextStimulus]);

    useEffect(() => {
        if (!isActive) {
            setRound(0);
            setLives(3);
            setHits(0);
            setMisses(0);
            setFalseAlarms(0);
            setReactionTimes([]);
            setCurrentColor(null);
            setShowStimulus(false);
            setFeedback(null);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isActive]);

    const handleTap = () => {
        if (!isActive || !showStimulus || feedback) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        const reactionTime = Date.now() - showTimeRef.current;

        if (currentColor === TARGET_COLOR) {
            // Hit correct
            const points = Math.max(10, 50 - Math.floor(reactionTime / 20));
            onScore(points);
            setHits((h: number) => h + 1);
            setReactionTimes((rt: number[]) => [...rt, reactionTime]);
            setFeedback('hit');
        } else {
            // False alarm - tapped on distractor
            setFalseAlarms((fa: number) => fa + 1);
            setLives((l: number) => l - 1);
            setFeedback('false');
        }

        setShowStimulus(false);
        setTimeout(() => {
            setRound((r: number) => r + 1);
            setFeedback(null);
        }, 500);
    };

    if (!isActive) return null;

    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'pointer', userSelect: 'none' }}
            onClick={handleTap}
        >
            <div
                style={{
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: showStimulus && currentColor
                        ? COLOR_HEX[currentColor]
                        : 'var(--bg-card)',
                    transition: 'all 0.1s ease',
                    boxShadow: showStimulus && currentColor
                        ? `0 0 50px ${COLOR_HEX[currentColor]}`
                        : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {!showStimulus && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Attends...
                    </span>
                )}
            </div>

            {feedback === 'hit' && (
                <div className="scaleIn" style={{ marginTop: 24, color: 'var(--green)', fontWeight: 700 }}>
                    ✓ HIT!
                </div>
            )}
            {feedback === 'miss' && (
                <div className="scaleIn" style={{ marginTop: 24, color: 'var(--red)', fontWeight: 700 }}>
                    ✗ Miss...
                </div>
            )}
            {feedback === 'false' && (
                <div className="scaleIn" style={{ marginTop: 24, color: 'var(--orange)', fontWeight: 700 }}>
                    ✗ Faux positif!
                </div>
            )}

            <p style={{ color: 'var(--text-muted)', marginTop: 40, fontSize: '0.9rem' }}>
                Tape n'importe où sur l'écran
            </p>
        </div>
    );
};

export default ReactionGame;
