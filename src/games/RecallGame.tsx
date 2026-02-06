import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import Stat from '../components/Stat';
import { RECALL_WORDS } from '../data/gameData';
import { pickN, shuffle } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

interface RecallGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

type Phase = 'memorize' | 'distract' | 'recall';

interface CloudWord {
    text: string;
    id: string;
    x: number;
    y: number;
    size: number;
    rotation: number;
    delay: number;
    duration: number;
}

const RecallGame: React.FC<RecallGameProps> = ({ onScore, isActive }) => {
    const [phase, setPhase] = useState<Phase>('memorize');
    const [targets, setTargets] = useState<string[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [level, setLevel] = useState(1);
    const [timer, setTimer] = useState(5);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [cloudWords, setCloudWords] = useState<CloudWord[]>([]);

    const generateCloud = useCallback(() => {
        const cloudSize = 70; // Even more density for complete saturation
        const wordsFromData = pickN(RECALL_WORDS, Math.min(cloudSize, RECALL_WORDS.length));

        while (wordsFromData.length < cloudSize) {
            wordsFromData.push(...pickN(RECALL_WORDS, cloudSize - wordsFromData.length));
        }

        const words: CloudWord[] = wordsFromData.map((word, i) => ({
            text: word,
            id: `cloud-${i}-${word}-${Math.random()}`,
            x: Math.random() * 92 + 4,
            y: Math.random() * 92 + 4,
            size: Math.random() * 1.6 + 0.5,
            rotation: Math.random() * 60 - 30,
            delay: Math.random() * 0.5,
            duration: Math.random() * 0.4 + 0.1 // Very fast flicker
        }));
        setCloudWords(words);
    }, []);

    const startRound = useCallback(() => {
        if (!isActive) return;
        const wordCount = Math.min(3 + Math.floor(level / 2), 8);
        const distractorCount = 8;
        const newTargets = pickN(RECALL_WORDS, wordCount);
        const distractors = pickN(
            RECALL_WORDS.filter((w) => !newTargets.includes(w)),
            distractorCount
        );

        setTargets(newTargets);
        setOptions(shuffle([...newTargets, ...distractors]));
        setSelected([]);
        setTimer(4);
        setPhase('memorize');
        setFeedback(null);
    }, [level, isActive]);

    useEffect(() => {
        if (isActive) {
            startRound();
        } else {
            setLevel(1);
            setPhase('memorize');
            setTargets([]);
        }
    }, [isActive, startRound]);

    // Timer Logic
    useEffect(() => {
        if (!isActive || feedback) return;

        if (timer > 0) {
            const t = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(t);
        }

        if (timer === 0) {
            if (phase === 'memorize') {
                generateCloud();
                setTimer(2); // Intense 2s distraction
                setPhase('distract');
            } else if (phase === 'distract') {
                setPhase('recall');
            }
        }
    }, [timer, phase, isActive, feedback, generateCloud]);

    const handleWordSelect = (word: string) => {
        if (!isActive || phase !== 'recall' || feedback) return;

        if (selected.includes(word)) {
            setSelected(selected.filter(w => w !== word));
        } else if (selected.length < targets.length) {
            setSelected([...selected, word]);
        }
    };

    const validateRecall = () => {
        if (!isActive || phase !== 'recall' || feedback) return;

        const isCorrect = selected.length === targets.length &&
            selected.every(w => targets.includes(w));

        if (isCorrect) {
            setFeedback('success');
            onScore(level * 100);
            setTimeout(() => {
                setLevel(l => l + 1);
                startRound();
            }, 1000);
        } else {
            setFeedback('error');
            setTimeout(() => {
                setFeedback(null);
                setSelected([]);
            }, 1200);
        }
    };

    if (!isActive) return null;

    const flashClass = feedback === 'success' ? 'flash-success' : feedback === 'error' ? 'flash-error' : '';

    return (
        <div
            className={`fadeIn ${flashClass}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                transition: 'background-color 0.4s ease',
                position: 'relative'
            }}
        >
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Stat label="NIVEAU" value={level} color="var(--purple)" />
            </div>

            {/* Feedback Overlays */}
            <AnimatePresence>
                {feedback === 'success' && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0.8 }}
                        exit={{ scale: 2, opacity: 0 }}
                        style={{ position: 'absolute', zIndex: 1000, fontSize: '12rem', color: 'var(--green)' }}
                    >✓</motion.div>
                )}
                {feedback === 'error' && (
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: [0, -20, 20, -20, 20, 0], opacity: 0.8 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'absolute', zIndex: 1000, fontSize: '12rem', color: 'var(--red)' }}
                    >✗</motion.div>
                )}
            </AnimatePresence>

            <div style={{ width: '100%', maxWidth: 800 }}>
                <p style={{
                    color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16,
                    fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 800
                }}>
                    Rappel Différé
                </p>

                {phase === 'memorize' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                        <Card style={{ padding: '48px 32px', marginBottom: 32, boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
                            <h2 style={{ fontSize: '1.4rem', marginBottom: 32, fontWeight: 800, color: 'var(--purple)' }}>Concentrez-vous</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                                {targets.map(w => (
                                    <span key={w} style={{
                                        padding: '12px 24px', background: 'var(--bg-card)', border: '1px solid rgba(0,0,0,0.05)',
                                        borderRadius: 'var(--radius-lg)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)'
                                    }}>
                                        {w}
                                    </span>
                                ))}
                            </div>
                        </Card>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--purple)', opacity: 0.4 }}>{timer}s</div>
                    </motion.div>
                )}

                {phase === 'distract' && (
                    <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1000, backgroundColor: 'white', overflow: 'hidden' }}>
                        {cloudWords.map(w => (
                            <motion.div
                                key={w.id}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, 0.8, 0, 0.6, 0]
                                }}
                                transition={{
                                    duration: w.duration,
                                    delay: w.delay,
                                    repeat: Infinity,
                                    repeatType: "mirror"
                                }}
                                style={{
                                    position: 'absolute',
                                    left: `${w.x}%`,
                                    top: `${w.y}%`,
                                    fontSize: `${w.size}rem`,
                                    fontWeight: 900,
                                    color: 'var(--text-primary)',
                                    transform: `rotate(${w.rotation}deg)`,
                                    pointerEvents: 'none',
                                    whiteSpace: 'nowrap',
                                    filter: 'blur(0.2px)'
                                }}
                            >
                                {w.text}
                            </motion.div>
                        ))}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            fontSize: '4rem', fontWeight: 900, color: 'var(--purple)', zIndex: 1100,
                            textShadow: '0 0 40px rgba(255,255,255,1)'
                        }}>
                            DISTRACTION
                        </div>
                    </div>
                )}

                {phase === 'recall' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
                        <Card style={{ padding: '32px', marginBottom: 40, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: 32, fontWeight: 700, color: 'var(--text-muted)' }}>Mots de la liste initiale ?</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                                {options.map(w => (
                                    <button
                                        key={w}
                                        className="btn"
                                        onClick={() => handleWordSelect(w)}
                                        style={{
                                            padding: '16px 28px', borderRadius: 'var(--radius-md)',
                                            background: selected.includes(w) ? 'var(--purple)' : 'white',
                                            color: selected.includes(w) ? 'white' : 'var(--text-primary)',
                                            border: 'none', fontWeight: 800, fontSize: '1rem',
                                            boxShadow: selected.includes(w) ? 'none' : '0 4px 0 rgba(0,0,0,0.05), 0 8px 20px rgba(0,0,0,0.03)',
                                            transform: selected.includes(w) ? 'translateY(4px)' : 'none',
                                            transition: 'all 0.1s ease'
                                        }}
                                    >
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <button
                            className="btn"
                            disabled={selected.length !== targets.length || !!feedback}
                            onClick={validateRecall}
                            style={{
                                height: 64, width: 280, borderRadius: 'var(--radius-xl)', border: 'none',
                                background: 'var(--purple)', color: 'white', fontWeight: 900, fontSize: '1.1rem',
                                letterSpacing: '0.1em',
                                boxShadow: selected.length === targets.length ? '0 8px 0 #7e22ce, 0 15px 30px rgba(168,85,247,0.4)' : 'none',
                                opacity: selected.length === targets.length ? 1 : 0.4,
                                transform: feedback ? 'translateY(4px)' : 'none',
                                cursor: selected.length === targets.length ? 'pointer' : 'default'
                            }}
                        >
                            VÉRIFIER LE RAPPEL ({selected.length}/{targets.length})
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RecallGame;
