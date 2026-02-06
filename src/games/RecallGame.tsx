import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    color: string;
    isTarget: boolean;
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
    const [oddWordFound, setOddWordFound] = useState(false);

    const generateCloud = useCallback((targetWords: string[]) => {
        const cloudSize = 15;
        // Mix of semantically similar words and random ones
        // In a real app, we'd have a semantic map. Here we'll just pick more words from RECALL_WORDS
        const others = pickN(RECALL_WORDS.filter(w => !targetWords.includes(w)), cloudSize);

        // Pick one "Odd" word that will be in a different color
        const oddIdx = Math.floor(Math.random() * others.length);

        const words: CloudWord[] = others.map((word, i) => ({
            text: word,
            id: `cloud-${i}-${word}`,
            x: Math.random() * 80 + 10, // 10% to 90%
            y: Math.random() * 80 + 10,
            size: Math.random() * 1.5 + 0.8,
            color: i === oddIdx ? 'var(--magenta)' : 'var(--text-primary)',
            isTarget: i === oddIdx
        }));
        setCloudWords(words);
        setOddWordFound(false);
    }, []);

    const startRound = useCallback(() => {
        if (!isActive) return;
        const wordCount = Math.min(3 + Math.floor(level / 2), 8);
        const distractorCount = 6;
        const newTargets = pickN(RECALL_WORDS, wordCount);
        const distractors = pickN(
            RECALL_WORDS.filter((w) => !newTargets.includes(w)),
            distractorCount
        );

        setTargets(newTargets);
        setOptions(shuffle([...newTargets, ...distractors]));
        setSelected([]);
        setTimer(5);
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
                generateCloud(targets);
                setTimer(8); // Distraction phase length
                setPhase('distract');
            } else if (phase === 'distract') {
                setPhase('recall');
            }
        }
    }, [timer, phase, isActive, feedback, targets, generateCloud]);

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

    const handleCloudClick = (word: CloudWord) => {
        if (word.isTarget) {
            setOddWordFound(true);
            onScore(10 * level); // Minor bonus for finding the odd one
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

            {/* Overlays */}
            <AnimatePresence>
                {feedback === 'success' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{
                        position: 'absolute', zIndex: 100, fontSize: '10rem', color: 'var(--green)', opacity: 0.8
                    }}>✓</motion.div>
                )}
                {feedback === 'error' && (
                    <motion.div initial={{ x: -20 }} animate={{ x: [0, -10, 10, -10, 10, 0] }} exit={{ opacity: 0 }} style={{
                        position: 'absolute', zIndex: 100, fontSize: '10rem', color: 'var(--red)', opacity: 0.8
                    }}>✗</motion.div>
                )}
            </AnimatePresence>

            <div style={{ width: '100%', maxWidth: 640 }}>
                <p style={{
                    color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16,
                    fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700
                }}>
                    Rappel Différé
                </p>

                {phase === 'memorize' && (
                    <div style={{ textAlign: 'center' }}>
                        <Card style={{ padding: '40px 32px', marginBottom: 24 }}>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: 24, opacity: 0.6 }}>Mémorisez ces mots</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                                {targets.map(w => (
                                    <span key={w} style={{
                                        padding: '10px 20px', background: 'var(--bg-card)',
                                        borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '1.2rem'
                                    }}>
                                        {w}
                                    </span>
                                ))}
                            </div>
                        </Card>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--purple)' }}>{timer}s</div>
                    </div>
                )}

                {phase === 'distract' && (
                    <div style={{ textAlign: 'center', height: 400, position: 'relative' }}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: 8, color: 'var(--magenta)', fontWeight: 800 }}>
                            {oddWordFound ? "Bien vu ! Continuez de regarder..." : "TROUVEZ L'INTRUS (COULEUR) !"}
                        </h2>
                        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-lg)' }}>
                            {cloudWords.map(w => (
                                <motion.div
                                    key={w.id}
                                    initial={{ x: `${w.x}%`, y: `${w.y}%`, opacity: 0 }}
                                    animate={{
                                        x: [`${w.x}%`, `${(w.x + 10) % 100}%`, `${w.x}%`],
                                        y: [`${w.y}%`, `${(w.y + 10) % 100}%`, `${w.y}%`],
                                        opacity: 1
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    onClick={() => handleCloudClick(w)}
                                    style={{
                                        position: 'absolute', cursor: 'pointer',
                                        fontSize: `${w.size}rem`, fontWeight: 700,
                                        color: oddWordFound && w.isTarget ? 'var(--green)' : w.color,
                                        textShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {w.text}
                                </motion.div>
                            ))}
                        </div>
                        <div style={{ marginTop: 16, fontSize: '1.5rem', fontWeight: 800 }}>{timer}s</div>
                    </div>
                )}

                {phase === 'recall' && (
                    <div style={{ textAlign: 'center' }}>
                        <Card style={{ padding: '32px', marginBottom: 32 }}>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: 24, opacity: 0.6 }}>Sélectionnez les mots du début</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                                {options.filter(w => typeof w === 'string').map(w => (
                                    <button
                                        key={w}
                                        className="btn"
                                        onClick={() => handleWordSelect(w)}
                                        style={{
                                            padding: '12px 24px', borderRadius: 'var(--radius-md)',
                                            background: selected.includes(w) ? 'var(--purple)' : 'white',
                                            color: selected.includes(w) ? 'white' : 'var(--text-primary)',
                                            border: 'none', fontWeight: 700,
                                            boxShadow: '0 4px 0 rgba(0,0,0,0.05)',
                                            transform: selected.includes(w) ? 'translateY(2px)' : 'none'
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
                                height: 56, width: 220, borderRadius: 'var(--radius-lg)', border: 'none',
                                background: 'var(--purple)', color: 'white', fontWeight: 800,
                                boxShadow: selected.length === targets.length ? '0 6px 0 #7e22ce, 0 10px 20px rgba(168,85,247,0.3)' : 'none',
                                opacity: selected.length === targets.length ? 1 : 0.5,
                                transform: feedback ? 'translateY(4px)' : 'none'
                            }}
                        >
                            VALIDER ({selected.length}/{targets.length})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecallGame;
