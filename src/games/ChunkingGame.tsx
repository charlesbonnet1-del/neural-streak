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

const ChunkingGame: React.FC<ChunkingGameProps> = ({ onBack, onScore, isActive }) => {
    const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
    const [numbers, setNumbers] = useState<number[]>([]);
    const [chunks, setChunks] = useState<string[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [timer, setTimer] = useState(0);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

    const genLevel = useCallback(() => {
        if (!isActive) return;
        const len = 4 + level * 2;
        const nums = Array.from({ length: len }, () => Math.floor(Math.random() * 10));
        const chunkSize = 2 + Math.floor(level / 2);
        const chunked: string[] = [];
        for (let i = 0; i < nums.length; i += chunkSize) {
            chunked.push(nums.slice(i, i + chunkSize).join(''));
        }
        setNumbers(nums);
        setChunks(chunked);
        setTimer(3 + level);
        setPhase('memorize');
    }, [level, isActive]);

    useEffect(() => {
        if (isActive) {
            genLevel();
        } else {
            setPhase('memorize');
            setLevel(1);
            setLives(3);
            setNumbers([]);
            setChunks([]);
        }
    }, [isActive, genLevel]);

    useEffect(() => {
        if (isActive && phase === 'memorize' && timer > 0) {
            const t = setTimeout(() => setTimer((x: number) => x - 1), 1000);
            return () => clearTimeout(t);
        } else if (isActive && phase === 'memorize' && timer === 0) {
            const correct = numbers.join('');
            const wrongs = [
                numbers.slice().reverse().join(''),
                numbers.map((n) => (n + 1) % 10).join(''),
                shuffle([...numbers]).join(''),
            ].filter((w) => w !== correct);
            setOptions(shuffle([correct, ...wrongs.slice(0, 3)]));
            setPhase('recall');
        }
    }, [isActive, phase, timer, numbers]);

    const handleAnswer = (ans: string) => {
        if (!isActive) return;
        const correct = numbers.join('');
        if (ans === correct) {
            setFeedback('success');
            onScore(level * 20);
            setTimeout(() => {
                setFeedback(null);
                setLevel((l: number) => l + 1);
                if (isActive) genLevel();
            }, 1000);
        } else {
            setFeedback('error');
            setLives((l: number) => l - 1);
            setTimeout(() => {
                setFeedback(null);
                if (isActive) genLevel();
            }, 1000);
        }
    };

    if (!isActive) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Stat label="NIVEAU" value={level} color="var(--cyan)" />
            </div>
            {phase === 'memorize' && (
                <>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                        Mémorise cette séquence :
                    </p>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        {chunks.map((ch, i) => (
                            <div
                                key={i}
                                className="glass"
                                style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)' }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '1.4rem',
                                        fontWeight: 700,
                                        color: 'var(--cyan)',
                                    }}
                                >
                                    {ch}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="progress-bar-container" style={{ width: '100%', maxWidth: 300, height: 6, marginBottom: 16 }}>
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${(timer / (3 + level)) * 100}%`,
                                background: 'var(--cyan)',
                                transition: 'width 1s linear'
                            }}
                        />
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        💡 Regroupe en chunks pour mieux mémoriser
                    </p>
                </>
            )}
            {phase === 'recall' && (
                <>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                        Quelle était la séquence ?
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                            width: '100%',
                            maxWidth: 360,
                        }}
                    >
                        {options.map((opt, i) => (
                            <OptionBtn
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                disabled={!!feedback}
                                correct={feedback && opt === numbers.join('')}
                                wrong={feedback === 'error' && opt !== numbers.join('')}
                            >
                                <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>{opt}</span>
                            </OptionBtn>
                        ))}
                    </div>
                </>
            )}
            {feedback && (
                <Feedback type={feedback} message={feedback === 'success' ? 'Exact !' : 'Incorrect !'} />
            )}
        </div>
    );
};

export default ChunkingGame;
