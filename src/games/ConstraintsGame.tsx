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
}

const ConstraintsGame: React.FC<ConstraintsGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'playing' | 'result'>('playing');
    const [current, setCurrent] = useState<ConstraintsData | null>(null);
    const [options, setOptions] = useState<{ phrase: string; isValid: boolean }[]>([]);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 6;

    const next = useCallback(() => {
        const avail = CONSTRAINTS_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            const idx = 0;
            const item = CONSTRAINTS_DATA[idx];
            setCurrent(item);
            generateOptions(item);
            return;
        }
        const idx = pick(avail);
        setUsed((p) => [...p, idx]);
        const item = CONSTRAINTS_DATA[idx];
        setCurrent(item);
        generateOptions(item);
        setFeedback(null);
    }, [used]);

    const generateOptions = (item: ConstraintsData) => {
        const validPhrase = pick(item.validPhrases);
        const invalidPhrase = pick(item.invalidPhrases);
        const allOptions = shuffle([
            { phrase: validPhrase, isValid: true },
            { phrase: invalidPhrase, isValid: false },
        ]);
        setOptions(allOptions);
    };

    useEffect(() => {
        next();
    }, []);

    const handleAnswer = (isValid: boolean) => {
        const correct = isValid;
        if (correct) {
            setFeedback('success');
            setScore((s) => s + 35);
            setTimeout(() => {
                if (round + 1 >= maxRounds) setPhase('result');
                else {
                    setRound((r) => r + 1);
                    next();
                }
            }, 1200);
        } else {
            setFeedback('error');
            setLives((l) => l - 1);
            if (lives <= 1) setTimeout(() => setPhase('result'), 1000);
            else
                setTimeout(() => {
                    setRound((r) => r + 1);
                    next();
                }, 1500);
        }
    };

    if (phase === 'result') {
        return (
            <ResultScreen
                score={score}
                maxScore={maxRounds * 35}
                stats={{ 'Réussies': `${round}/${maxRounds}` }}
                onRetry={() => {
                    setRound(0);
                    setScore(0);
                    setLives(3);
                    setUsed([]);
                    next();
                    setPhase('playing');
                }}
                onBack={onBack}
            />
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header
                title="Contraintes Créatives"
                subtitle="Identifie la phrase valide"
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(round / maxRounds) * 100}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                {current && (
                    <>
                        <Card>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                                Construis une phrase avec ces mots :
                            </p>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                                {current.words.map((word) => (
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

                        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
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
        </div>
    );
};

export default ConstraintsGame;
