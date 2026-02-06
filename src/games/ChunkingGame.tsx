import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import OptionBtn from '../components/OptionBtn';
import Feedback from '../components/Feedback';
import { shuffle } from '../utils/helpers';

import Stat from '../components/Stat';

interface ChunkingGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const ChunkingGame: React.FC<ChunkingGameProps> = ({ onScore, isActive }) => {
    const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
    const [numbers, setNumbers] = useState<number[]>([]);
    const [chunks, setChunks] = useState<string[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [level, setLevel] = useState(1);
    const [timer, setTimer] = useState(-1); // Start at -1 to avoid accidental trigger
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

    const genLevel = useCallback(() => {
        if (!isActive) return;

        // Adaptive length and chunk size
        // User wants more groups of fewer digits as difficulty increases.
        const len = 4 + level * 2;
        const nums = Array.from({ length: len }, () => Math.floor(Math.random() * 10));

        // Chunk size: starts at 3-4, then goes down to 2 for higher levels to create MORE chunks
        const chunkSize = level > 5 ? 2 : level > 2 ? 3 : 4;

        const chunked: string[] = [];
        for (let i = 0; i < nums.length; i += chunkSize) {
            chunked.push(nums.slice(i, i + chunkSize).join(''));
        }

        setNumbers(nums);
        setChunks(chunked);
        setTimer(4 + Math.floor(level / 2));
        setPhase('memorize');
    }, [level, isActive]);

    useEffect(() => {
        if (isActive) {
            genLevel();
        } else {
            setPhase('memorize');
            setLevel(1);
            setNumbers([]);
            setChunks([]);
            setTimer(-1);
        }
    }, [isActive]);

    useEffect(() => {
        if (isActive && phase === 'memorize' && timer > 0) {
            const t = setTimeout(() => setTimer((x) => x - 1), 1000);
            return () => clearTimeout(t);
        } else if (isActive && phase === 'memorize' && timer === 0 && numbers.length > 0) {
            const correct = numbers.join('');

            // Generate very similar options
            const generateWrong = () => {
                const arr = [...numbers];
                const idxToChange = Math.floor(Math.random() * arr.length);
                arr[idxToChange] = (arr[idxToChange] + 1 + Math.floor(Math.random() * 8)) % 10;
                return arr.join('');
            };

            const wrongs = new Set<string>();
            let attempts = 0;
            while (wrongs.size < 3 && attempts < 20) {
                const w = generateWrong();
                if (w !== correct) wrongs.add(w);
                attempts++;
            }

            setOptions(shuffle([correct, ...Array.from(wrongs)]));
            setPhase('recall');
        }
    }, [isActive, phase, timer, numbers]);

    const handleAnswer = (ans: string) => {
        if (!isActive || feedback) return;
        const correct = numbers.join('');

        if (ans === correct) {
            onScore(level * 25);
            setFeedback('success');
            setTimeout(() => {
                setFeedback(null);
                setLevel((l) => l + 1);
                genLevel();
            }, 800);
        } else {
            setFeedback('error');
            setTimeout(() => {
                setFeedback(null);
                genLevel(); // Restart same level
            }, 800);
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
                padding: 20,
                transition: 'background-color 0.3s ease'
            }}
        >
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Stat label="NIVEAU" value={level} color="var(--blue)" />
            </div>

            {phase === 'memorize' && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.95rem' }}>
                        Mémorise cette séquence :
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
                        {chunks.map((ch, i) => (
                            <div
                                key={i}
                                className="glass"
                                style={{
                                    padding: '12px 20px',
                                    borderRadius: 'var(--radius-md)',
                                    minWidth: 60,
                                    textAlign: 'center'
                                }}
                            >
                                <span style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)'
                                }}>
                                    {ch}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="progress-bar" style={{ width: '100%', maxWidth: 200, margin: '0 auto 16px' }}>
                        <div
                            className="progress-fill"
                            style={{
                                width: `${(timer / (4 + Math.floor(level / 2))) * 100}%`,
                                background: 'var(--blue)',
                                transition: 'width 1s linear'
                            }}
                        />
                    </div>
                </div>
            )}

            {phase === 'recall' && (
                <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                        Quelle était la séquence ?
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {options.map((opt, i) => (
                            <OptionBtn
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                disabled={!!feedback}
                                correct={feedback === 'success' && opt === numbers.join('')}
                                wrong={feedback === 'error' && opt !== numbers.join('')}
                            >
                                <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: 3, fontWeight: 600 }}>{opt}</span>
                            </OptionBtn>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChunkingGame;
