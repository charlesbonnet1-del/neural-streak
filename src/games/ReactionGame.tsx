import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import { COLOR_HEX } from '../data/gameData';

interface ReactionGameProps {
    onBack: () => void;
}

type StimulusColor = 'green' | 'red' | 'yellow' | 'blue';

const ReactionGame: React.FC<ReactionGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
    const [currentColor, setCurrentColor] = useState<StimulusColor | null>(null);
    const [showStimulus, setShowStimulus] = useState(false);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
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
        if (round >= maxRounds) {
            setPhase('result');
            return;
        }

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
                setMisses((m) => m + 1);
                setLives((l) => {
                    if (l <= 1) {
                        setPhase('result');
                        return 0;
                    }
                    return l - 1;
                });
                setFeedback('miss');
            }
            setShowStimulus(false);
            setTimeout(() => {
                setRound((r) => r + 1);
            }, 500);
        }, STIMULUS_DURATION);
    }, [round]);

    useEffect(() => {
        if (phase === 'playing' && !showStimulus && feedback === null) {
            const delay = 500 + Math.random() * 1000;
            const timer = setTimeout(nextStimulus, delay);
            return () => clearTimeout(timer);
        }
    }, [phase, showStimulus, feedback, nextStimulus]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleTap = () => {
        if (!showStimulus || feedback) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        const reactionTime = Date.now() - showTimeRef.current;

        if (currentColor === TARGET_COLOR) {
            // Hit correct
            const points = Math.max(10, 50 - Math.floor(reactionTime / 20));
            setScore((s) => s + points);
            setHits((h) => h + 1);
            setReactionTimes((rt) => [...rt, reactionTime]);
            setFeedback('hit');
        } else {
            // False alarm - tapped on distractor
            setFalseAlarms((fa) => fa + 1);
            setLives((l) => {
                if (l <= 1) {
                    setPhase('result');
                    return 0;
                }
                return l - 1;
            });
            setFeedback('false');
        }

        setShowStimulus(false);
        setTimeout(() => {
            setRound((r) => r + 1);
            setFeedback(null);
        }, 500);
    };

    const startGame = () => {
        setPhase('playing');
        setRound(0);
        setScore(0);
        setLives(3);
        setHits(0);
        setMisses(0);
        setFalseAlarms(0);
        setReactionTimes([]);
    };

    const avgRT = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 0;

    if (phase === 'result') {
        return (
            <ResultScreen
                score={score}
                stats={{
                    'Hits': hits,
                    'Misses': misses,
                    'Faux +': falseAlarms,
                    'Temps moy.': `${avgRT}ms`,
                }}
                onRetry={startGame}
                onBack={onBack}
            />
        );
    }

    if (phase === 'intro') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header title="Go / No-Go" onBack={onBack} />
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                        textAlign: 'center',
                    }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: 24 }}>⚡</div>
                    <h2 style={{ marginBottom: 16 }}>Règles du jeu</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                        Tape sur l'écran quand tu vois
                    </p>
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: COLOR_HEX.green,
                            margin: '16px auto',
                            boxShadow: `0 0 30px ${COLOR_HEX.green}`,
                        }}
                    />
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                        <strong>VERT seulement !</strong>
                        <br />
                        Ignore les autres couleurs.
                    </p>
                    <button className="btn btn-primary" onClick={startGame}>
                        Commencer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
            onClick={handleTap}
        >
            <Header
                title="Go / No-Go"
                subtitle="Tape sur VERT seulement"
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(round / maxRounds) * 100}
            />
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    cursor: 'pointer',
                    userSelect: 'none',
                }}
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
        </div>
    );
};

export default ReactionGame;
