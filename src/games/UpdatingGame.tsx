import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import OptionBtn from '../components/OptionBtn';
import Feedback from '../components/Feedback';
import { COLORS, COLOR_HEX } from '../data/gameData';
import { pick, shuffle } from '../utils/helpers';
import { Color } from '../types';

import Stat from '../components/Stat';

interface UpdatingGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const UpdatingGame: React.FC<UpdatingGameProps> = ({ onScore, isActive }) => {
    const [phase, setPhase] = useState<'memorize' | 'transform' | 'recall'>('memorize');
    const [initList, setInitList] = useState<Color[]>([]);
    const [finalList, setFinalList] = useState<Color[]>([]);
    const [instructions, setInstructions] = useState<string[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [level, setLevel] = useState(1);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [timer, setTimer] = useState(0);

    const genRound = useCallback(() => {
        if (!isActive) return;

        // Adaptive list size: 3 colors at start, increases slowly
        const size = level > 6 ? 5 : level > 3 ? 4 : 3;
        const init = Array.from({ length: size }, () => pick(COLORS));
        let current = [...init];
        const ops: string[] = [];

        // Number of operations: 1 at start, more as level goes up
        const numOps = level > 5 ? 3 : level > 2 ? 2 : 1;

        for (let i = 0; i < numOps; i++) {
            const opType = pick(
                (['add', 'remove', 'swap', 'reverse'] as const).filter((t) => {
                    if (t === 'remove' && current.length <= 2) return false;
                    if (t === 'add' && current.length >= 6) return false;
                    if (t === 'swap' && current.length <= 1) return false;
                    return true;
                })
            );

            if (opType === 'add') {
                const c = pick(COLORS);
                ops.push(`Ajoute ${c}`);
                current.push(c);
            } else if (opType === 'remove') {
                const p = Math.floor(Math.random() * current.length) + 1;
                const ord = p === 1 ? '1er' : `${p}ème`;
                ops.push(`Supprime le ${ord}`);
                current.splice(p - 1, 1);
            } else if (opType === 'swap') {
                const p1 = Math.floor(Math.random() * current.length) + 1;
                let p2 = Math.floor(Math.random() * current.length) + 1;
                while (p2 === p1) p2 = Math.floor(Math.random() * current.length) + 1;
                ops.push(`Échange ${p1} et ${p2}`);
                [current[p1 - 1], current[p2 - 1]] = [current[p2 - 1], current[p1 - 1]];
            } else {
                ops.push(`Inverse l'ordre`);
                current.reverse();
            }
        }

        setInitList(init);
        setFinalList(current);
        setInstructions(ops);

        const correct = current.join('-');
        const wrongs = new Set<string>();
        let safety = 0;
        while (wrongs.size < 3 && safety < 30) {
            const w = shuffle([...current]).join('-');
            if (w !== correct) wrongs.add(w);
            safety++;
        }
        // If shuffle isn't enough, replace some colors
        if (wrongs.size < 3) {
            while (wrongs.size < 3) {
                const w = current.map((c, i) => i === 0 ? pick(COLORS) : c).join('-');
                if (w !== correct) wrongs.add(w);
            }
        }

        setOptions(shuffle([correct, ...Array.from(wrongs)]));
        setPhase('memorize');
        setTimer(3);
    }, [level, isActive]);

    useEffect(() => {
        if (isActive) {
            genRound();
        } else {
            setPhase('memorize');
            setLevel(1);
            setInitList([]);
            setFinalList([]);
        }
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;

        if (phase === 'memorize' && timer > 0) {
            const t = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(t);
        } else if (phase === 'memorize' && timer === 0) {
            setPhase('transform');
            setTimer(3 + (instructions.length - 1) * 2); // More time for more ops
        } else if (phase === 'transform' && timer > 0) {
            const t = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(t);
        } else if (phase === 'transform' && timer === 0) {
            setPhase('recall');
        }
    }, [isActive, phase, timer, instructions.length]);

    const handleAnswer = (ans: string) => {
        if (!isActive || feedback) return;
        const correct = finalList.join('-');

        if (ans === correct) {
            onScore(level * 30);
            setFeedback('success');
            setTimeout(() => {
                setFeedback(null);
                setLevel((l) => l + 1);
                genRound();
            }, 800);
        } else {
            setFeedback('error');
            setTimeout(() => {
                setFeedback(null);
                genRound(); // Repeat level
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
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Mémorise la liste initiale :</p>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                        {initList.map((c, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 'var(--radius-md)',
                                        background: COLOR_HEX[c],
                                        boxShadow: `0 4px 12px ${COLOR_HEX[c]}44`,
                                        marginBottom: 8
                                    }}
                                />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{i + 1}</span>
                            </div>
                        ))}
                    </div>
                    <div className="progress-bar" style={{ width: 120, margin: '0 auto' }}>
                        <div className="progress-fill" style={{ width: `${(timer / 3) * 100}%`, background: 'var(--blue)' }} />
                    </div>
                </div>
            )}

            {phase === 'transform' && (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Transformation :</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                        {instructions.map((instr, i) => (
                            <div key={i} className="glass" style={{ padding: '16px 24px', borderRadius: 'var(--radius-lg)' }}>
                                <span style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                                    {instr}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="progress-bar" style={{ width: 120, margin: '0 auto' }}>
                        <div className="progress-fill" style={{ width: `${(timer / (3 + (instructions.length - 1) * 2)) * 100}%`, background: 'var(--blue)' }} />
                    </div>
                </div>
            )}

            {phase === 'recall' && (
                <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Quelle est la liste finale ?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {options.map((opt, i) => (
                            <OptionBtn
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                disabled={!!feedback}
                                correct={feedback === 'success' && opt === finalList.join('-')}
                                wrong={feedback === 'error' && opt !== finalList.join('-')}
                            >
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                    {opt.split('-').map((c, j) => (
                                        <div
                                            key={j}
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 6,
                                                background: COLOR_HEX[c as Color],
                                                border: '1px solid rgba(0,0,0,0.05)'
                                            }}
                                        />
                                    ))}
                                </div>
                            </OptionBtn>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdatingGame;
