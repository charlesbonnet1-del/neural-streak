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

const UpdatingGame: React.FC<UpdatingGameProps> = ({ onBack, onScore, isActive }) => {
    const [phase, setPhase] = useState<'playing'>('playing');
    const [initList, setInitList] = useState<Color[]>([]);
    const [finalList, setFinalList] = useState<Color[]>([]);
    const [instruction, setInstruction] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [level, setLevel] = useState(1);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [showInstr, setShowInstr] = useState(true);
    const maxRounds = 5;

    const genRound = useCallback(() => {
        if (!isActive) return;
        const size = 3 + Math.floor(level / 2);
        const init = Array.from({ length: size }, () => pick(COLORS));
        let current = [...init];
        const ops: string[] = [];
        const numOps = 1 + Math.floor(level / 2);

        for (let i = 0; i < numOps; i++) {
            const opType = pick(
                (['add', 'remove', 'swap', 'reverse'] as const).filter((t) => {
                    if (t === 'remove' && current.length <= 2) return false;
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
                ops.push(`Supprime le ${p}ème`);
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
        setInstruction(ops.join(' → '));
        const correct = current.join('-');
        const wrongs = [
            shuffle([...current]).join('-'),
            [...current].reverse().join('-'),
            current.map(() => pick(COLORS)).join('-'),
        ].filter((w) => w !== correct);
        setOptions(shuffle([correct, ...wrongs.slice(0, 3)]));
        setShowInstr(true);
    }, [level, isActive]);

    useEffect(() => {
        if (isActive) {
            genRound();
        } else {
            setRound(0);
            setLevel(1);
            setLives(3);
            setInitList([]);
            setFinalList([]);
        }
    }, [isActive, genRound]);

    useEffect(() => {
        if (isActive && showInstr) {
            const t = setTimeout(() => setShowInstr(false), 3000 + level * 500);
            return () => clearTimeout(t);
        }
    }, [isActive, showInstr, level]);

    const handleAnswer = (ans: string) => {
        if (!isActive) return;
        const correct = finalList.join('-');
        if (ans === correct) {
            setFeedback('success');
            onScore(level * 25);
            setTimeout(() => {
                setFeedback(null);
                if (round + 1 >= maxRounds) {
                    setLevel((l: number) => l + 1);
                    setRound(0);
                } else setRound((r: number) => r + 1);
                if (isActive) genRound();
            }, 1000);
        } else {
            setFeedback('error');
            setLives((l: number) => l - 1);
            setTimeout(() => {
                setFeedback(null);
                if (isActive) genRound();
            }, 1000);
        }
    };

    if (!isActive) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Stat label="NIVEAU" value={level} color="var(--cyan)" />
            </div>
            {showInstr ? (
                <>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>Liste initiale :</p>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        {initList.map((c, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: 10,
                                    background: COLOR_HEX[c],
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    color: '#000',
                                }}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                    <Card>
                        <p style={{ color: 'var(--yellow)', fontWeight: 600, textAlign: 'center' }}>
                            📝 {instruction}
                        </p>
                    </Card>
                    <p style={{ color: 'var(--text-muted)', marginTop: 16, fontSize: '0.85rem' }}>
                        Mémorise les transformations...
                    </p>
                </>
            ) : (
                <>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                        Quel est le résultat final ?
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
                                correct={feedback && opt === finalList.join('-')}
                                wrong={feedback === 'error' && opt !== finalList.join('-')}
                            >
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {opt.split('-').map((c, j) => (
                                        <div
                                            key={j}
                                            style={{ width: 32, height: 32, borderRadius: 6, background: COLOR_HEX[c as Color] }}
                                        />
                                    ))}
                                </div>
                            </OptionBtn>
                        ))}
                    </div>
                </>
            )}
            {feedback && (
                <Feedback type={feedback} message={feedback === 'success' ? 'Correct !' : 'Incorrect !'} />
            )}
        </div>
    );
};

export default UpdatingGame;
