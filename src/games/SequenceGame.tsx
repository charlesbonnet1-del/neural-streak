import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Stat from '../components/Stat';
import ResultScreen from '../components/ResultScreen';
import Feedback from '../components/Feedback';
import { COLORS, COLOR_HEX } from '../data/gameData';
import { pick, sleep } from '../utils/helpers';
import { Color } from '../types';

interface SequenceGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const SequenceGame: React.FC<SequenceGameProps> = ({ onBack, onScore, isActive }) => {
    const [phase, setPhase] = useState<'ready' | 'showing' | 'input'>('ready');
    const [sequence, setSequence] = useState<Color[]>([]);
    const [userSeq, setUserSeq] = useState<Color[]>([]);
    const [level, setLevel] = useState(1);
    const [showIdx, setShowIdx] = useState(-1);
    const [clickIdx, setClickIdx] = useState<Color | null>(null);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

    const startLevel = useCallback(async () => {
        if (!isActive) return;
        const seq = Array.from({ length: level + 2 }, () => pick(COLORS));
        setSequence(seq);
        setUserSeq([]);
        setPhase('showing');
        for (let i = 0; i < seq.length; i++) {
            if (!isActive) return;
            await sleep(300);
            setShowIdx(i);
            await sleep(500);
            setShowIdx(-1);
        }
        await sleep(200);
        if (!isActive) return;
        setPhase('input');
    }, [level, isActive]);

    useEffect(() => {
        if (isActive && phase === 'ready') {
            const t = setTimeout(startLevel, 800);
            return () => clearTimeout(t);
        }
    }, [isActive, phase, startLevel]);

    useEffect(() => {
        if (!isActive) {
            setPhase('ready');
            setLevel(1);
            setUserSeq([]);
            setSequence([]);
        }
    }, [isActive]);

    const handleClick = async (color: Color) => {
        if (phase !== 'input' || !isActive || feedback) return;

        // Visual feedback for click
        setClickIdx(color);
        setTimeout(() => setClickIdx(null), 150);

        const newSeq = [...userSeq, color];
        setUserSeq(newSeq);

        if (newSeq[newSeq.length - 1] !== sequence[newSeq.length - 1]) {
            setFeedback('error');
            setTimeout(() => {
                setFeedback(null);
                if (isActive) setPhase('ready');
            }, 1000);
            return;
        }

        if (newSeq.length === sequence.length) {
            setFeedback('success');
            onScore(level * 15);
            setTimeout(() => {
                setFeedback(null);
                setLevel((l: number) => l + 1);
                if (isActive) setPhase('ready');
            }, 1000);
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
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                {phase === 'showing' && `Mémorise ! (${showIdx + 1}/${sequence.length})`}
                {phase === 'input' && `À toi ! (${userSeq.length}/${sequence.length})`}
                {phase === 'ready' && 'Prépare-toi...'}
            </p>
            <div
                className={feedback === 'error' ? 'shake' : ''}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}
            >
                {COLORS.map((c) => {
                    const isShowing = sequence[showIdx] === c;
                    const isClicking = clickIdx === c;
                    return (
                        <button
                            key={c}
                            onClick={() => handleClick(c)}
                            disabled={phase !== 'input' || !!feedback}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                background: COLOR_HEX[c],
                                cursor: phase === 'input' && !feedback ? 'pointer' : 'default',
                                opacity: phase === 'showing' && showIdx >= 0 && sequence[showIdx] !== c ? 0.4 : 1,
                                transform: isShowing || isClicking ? 'scale(1.1)' : 'scale(1)',
                                boxShadow: isShowing || isClicking ? `0 0 20px -5px ${COLOR_HEX[c]}` : 'var(--shadow-sm)',
                                transition: 'all 0.1s ease',
                                filter: isClicking ? 'brightness(1.1)' : 'none',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default SequenceGame;
