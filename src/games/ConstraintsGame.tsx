import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { CONSTRAINTS_DATA } from '../data/gameData';
import { pick, shuffle } from '../utils/helpers';
import { ConstraintsData } from '../types';

interface ConstraintsGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const ConstraintsGame: React.FC<ConstraintsGameProps> = ({ onBack, onScore, isActive }) => {
    const [current, setCurrent] = useState<ConstraintsData | null>(null);
    const [options, setOptions] = useState<{ phrase: string; isValid: boolean }[]>([]);
    const [round, setRound] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 6;

    const generateOptions = useCallback((item: ConstraintsData) => {
        const validPhrase = pick(item.validPhrases);
        const invalidPhrase = pick(item.invalidPhrases);
        const allOptions = shuffle([
            { phrase: validPhrase, isValid: true },
            { phrase: invalidPhrase, isValid: false },
        ]);
        setOptions(allOptions);
    }, []);

    const next = useCallback(() => {
        if (!isActive) return;
        const avail = CONSTRAINTS_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            const item = CONSTRAINTS_DATA[0];
            setCurrent(item);
            generateOptions(item);
            return;
        }
        const idx = pick(avail);
        setUsed((p: number[]) => [...p, idx]);
        const item = CONSTRAINTS_DATA[idx];
        setCurrent(item);
        generateOptions(item);
        setFeedback(null);
    }, [used, isActive, generateOptions]);

    useEffect(() => {
        if (isActive) {
            next();
        } else {
            setRound(0);
            setLives(3);
            setUsed([]);
            setCurrent(null);
            setOptions([]);
        }
    }, [isActive, next]);

    const handleAnswer = (isValid: boolean) => {
        if (!isActive || feedback) return;
        if (isValid) {
            setFeedback('success');
            onScore(35);
            setTimeout(() => {
                setRound((r: number) => r + 1);
                if (isActive) next();
            }, 1200);
        } else {
            setFeedback('error');
            setLives((l: number) => l - 1);
            setTimeout(() => {
                setRound((r: number) => r + 1);
                if (isActive) next();
            }, 1500);
        }
    };

    if (!isActive) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            {current && (
                <>
                    <Card style={{ width: '100%', maxWidth: 600 }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                            Construis une phrase avec ces mots :
                        </p>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {current.words.map((word: string) => (
                                <span
                                    key={word}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'var(--bg-elevated)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontWeight: 600,
                                        color: 'var(--cyan)',
                                    }}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </Card>

                    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 600 }}>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Quelle phrase est valide ?
                        </p>
                        {options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`btn-option ${feedback
                                    ? opt.isValid
                                        ? 'correct'
                                        : 'wrong'
                                    : ''
                                    }`}
                                onClick={() => handleAnswer(opt.isValid)}
                                disabled={!!feedback}
                            >
                                "{opt.phrase}"
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <Feedback
                            type={feedback}
                            message={feedback === 'success' ? 'Bien vu !' : 'Pas cette fois...'}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ConstraintsGame;
