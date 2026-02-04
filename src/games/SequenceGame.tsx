import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Feedback from '../components/Feedback';
import { COLORS, COLOR_HEX } from '../data/gameData';
import { pick, sleep } from '../utils/helpers';
import { Color } from '../types';

interface SequenceGameProps {
    onBack: () => void;
}

const SequenceGame: React.FC<SequenceGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'ready' | 'showing' | 'input' | 'result'>('ready');
    const [sequence, setSequence] = useState<Color[]>([]);
    const [userSeq, setUserSeq] = useState<Color[]>([]);
    const [level, setLevel] = useState(1);
    const [showIdx, setShowIdx] = useState(-1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

    const startLevel = useCallback(async () => {
        const seq = Array.from({ length: level + 2 }, () => pick(COLORS));
        setSequence(seq);
        setUserSeq([]);
        setPhase('showing');
        for (let i = 0; i < seq.length; i++) {
            await sleep(300);
            setShowIdx(i);
            await sleep(500);
            setShowIdx(-1);
        }
        await sleep(200);
        setPhase('input');
    }, [level]);

    useEffect(() => {
        if (phase === 'ready') {
            const t = setTimeout(startLevel, 800);
            return () => clearTimeout(t);
        }
    }, [phase, startLevel]);

    const handleClick = (color: Color) => {
        if (phase !== 'input') return;
        const newSeq = [...userSeq, color];
        setUserSeq(newSeq);
        if (newSeq[newSeq.length - 1] !== sequence[newSeq.length - 1]) {
            setFeedback('error');
            setLives((l) => l - 1);
            if (lives <= 1) setTimeout(() => setPhase('result'), 500);
            else setTimeout(() => { setFeedback(null); setPhase('ready'); }, 1000);
            return;
        }
        if (newSeq.length === sequence.length) {
            setFeedback('success');
            setScore((s) => s + level * 15);
            setTimeout(() => {
                setFeedback(null);
                setLevel((l) => l + 1);
                setPhase('ready');
            }, 1000);
        }
    };

    if (phase === 'result')
        return (
            <ResultScreen
                score={score}
                level={level}
                onRetry={() => {
                    setLevel(1);
                    setScore(0);
                    setLives(3);
                    setPhase('ready');
                }}
                onBack={onBack}
            />
        );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="Séquence Visuelle" onBack={onBack} lives={lives} score={score} level={level} />
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                }}
            >
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontFamily: 'var(--font-mono)' }}>
                    {phase === 'showing' && `Mémorise ! (${showIdx + 1}/${sequence.length})`}
                    {phase === 'input' && `À toi ! (${userSeq.length}/${sequence.length})`}
                    {phase === 'ready' && 'Prépare-toi...'}
                </p>
                <div
                    className={feedback === 'error' ? 'shake' : ''}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}
                >
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            onClick={() => handleClick(c)}
                            disabled={phase !== 'input'}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                background: COLOR_HEX[c],
                                cursor: phase === 'input' ? 'pointer' : 'default',
                                opacity: phase === 'showing' && showIdx >= 0 && sequence[showIdx] !== c ? 0.3 : 1,
                                transform: sequence[showIdx] === c ? 'scale(1.15)' : 'scale(1)',
                                boxShadow: sequence[showIdx] === c ? `0 0 30px ${COLOR_HEX[c]}` : 'none',
                                transition: 'all 0.15s ease',
                            }}
                        />
                    ))}
                </div>
                {feedback && <Feedback type={feedback} message={feedback === 'success' ? 'Parfait !' : 'Raté !'} />}
            </div>
        </div>
    );
};

export default SequenceGame;
