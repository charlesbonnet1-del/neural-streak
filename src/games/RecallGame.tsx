import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import { RECALL_WORDS } from '../data/gameData';
import { pickN, shuffle } from '../utils/helpers';

interface RecallGameProps {
    onBack: () => void;
}

interface RecallGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

type Phase = 'memorize' | 'distract' | 'recall' | 'result';

const RecallGame: React.FC<RecallGameProps> = ({ onBack, onScore, isActive }) => {
    const [phase, setPhase] = useState<Phase>('memorize');
    const [targets, setTargets] = useState<string[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [timer, setTimer] = useState(5);
    const [calcNumbers, setCalcNumbers] = useState<[number, number]>([0, 0]);
    const maxRounds = 5;

    const startRound = useCallback(() => {
        if (!isActive) return;
        const wordCount = 3 + level;
        const distractorCount = 3;
        const newTargets = pickN(RECALL_WORDS, wordCount);
        const newDistractors = pickN(
            RECALL_WORDS.filter((w) => !newTargets.includes(w)),
            distractorCount
        );
        setTargets(newTargets);
        setOptions(shuffle([...newTargets, ...newDistractors]));
        setSelected([]);
        setTimer(5);
        setPhase('memorize');
    }, [level, isActive]);

    useEffect(() => {
        if (isActive) {
            startRound();
        } else {
            setRound(0);
            setLives(3);
            setLevel(1);
            setTargets([]);
            setOptions([]);
            setSelected([]);
            setPhase('memorize');
        }
    }, [isActive, startRound]);

    // Timer for memorize phase
    useEffect(() => {
        if (!isActive) return;
        if (phase === 'memorize' && timer > 0) {
            const t = setTimeout(() => setTimer((t: number) => t - 1), 1000);
            return () => clearTimeout(t);
        }
        if (phase === 'memorize' && timer === 0) {
            // Start distraction
            setCalcNumbers([
                Math.floor(Math.random() * 50) + 10,
                Math.floor(Math.random() * 50) + 10,
            ]);
            setTimer(5);
            setPhase('distract');
        }
    }, [phase, timer, isActive]);

    // Timer for distract phase
    useEffect(() => {
        if (!isActive) return;
        if (phase === 'distract' && timer > 0) {
            const t = setTimeout(() => setTimer((t: number) => t - 1), 1000);
            return () => clearTimeout(t);
        }
        if (phase === 'distract' && timer === 0) {
            setPhase('recall');
        }
    }, [phase, timer, isActive]);

    const handleCalcAnswer = (isCorrect: boolean) => {
        if (!isActive) return;
        if (isCorrect) {
            onScore(5);
        }
        setPhase('recall');
    };

    const handleWordSelect = (word: string) => {
        if (!isActive) return;
        if (selected.includes(word)) {
            setSelected(selected.filter((w) => w !== word));
        } else {
            setSelected([...selected, word]);
        }
    };

    const validateRecall = () => {
        if (!isActive) return;
        const hits = selected.filter((w) => targets.includes(w)).length;
        const falseAlarms = selected.filter((w) => !targets.includes(w)).length;
        const points = hits * 20 - falseAlarms * 10;
        const bonus = hits === targets.length && falseAlarms === 0 ? level * 10 : 0;
        const totalPoints = Math.max(0, points + bonus);

        if (hits < targets.length / 2 || falseAlarms > 2) {
            setLives((l: number) => l - 1);
        }

        onScore(totalPoints);

        if (round + 1 < maxRounds) {
            setRound((r: number) => r + 1);
            setLevel((l: number) => l + 1);
            startRound();
        }
    };

    if (!isActive) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                {phase === 'memorize' && (
                    <div className="fadeIn" style={{ textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                            Mémorise ces {targets.length} mots : ({timer}s)
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                            {targets.map((word) => (
                                <div
                                    key={word}
                                    className="glass"
                                    style={{
                                        padding: '12px 20px',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {word}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {phase === 'distract' && (
                    <div className="fadeIn" style={{ textAlign: 'center' }}>
                        <p style={{ color: 'var(--yellow)', marginBottom: 16, fontSize: '1.2rem' }}>
                            🧮 Calcule ! ({timer}s)
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>
                            {calcNumbers[0]} + {calcNumbers[1]} = ?
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            {[
                                calcNumbers[0] + calcNumbers[1],
                                calcNumbers[0] + calcNumbers[1] + 3,
                                calcNumbers[0] + calcNumbers[1] - 2,
                                calcNumbers[0] + calcNumbers[1] + 7,
                            ]
                                .sort(() => Math.random() - 0.5)
                                .map((ans) => (
                                    <button
                                        key={ans}
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            handleCalcAnswer(ans === calcNumbers[0] + calcNumbers[1]);
                                        }}
                                    >
                                        {ans}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

                {phase === 'recall' && (
                    <div className="fadeIn" style={{ textAlign: 'center', width: '100%', maxWidth: 500 }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                            Sélectionne les mots mémorisés :
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                            {options.map((word) => (
                                <button
                                    key={word}
                                    className={`btn ${selected.includes(word) ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => handleWordSelect(word)}
                                    style={{ padding: '10px 18px' }}
                                >
                                    {word}
                                </button>
                            ))}
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={validateRecall}
                            style={{ marginTop: 24 }}
                            disabled={selected.length === 0}
                        >
                            Valider ({selected.length} sélectionnés)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecallGame;
