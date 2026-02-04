import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import Feedback from '../components/Feedback';
import { RESOURCES_DATA } from '../data/gameData';
import { pick } from '../utils/helpers';
import { ResourcesData, ResourceObjective } from '../types';

interface ResourcesGameProps {
    onBack: () => void;
}

const ResourcesGame: React.FC<ResourcesGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<'playing' | 'result'>('playing');
    const [current, setCurrent] = useState<ResourcesData | null>(null);
    const [selected, setSelected] = useState<string[]>([]);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 5;

    const next = useCallback(() => {
        const avail = RESOURCES_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            setCurrent(RESOURCES_DATA[0]);
            setSelected([]);
            return;
        }
        const idx = pick(avail);
        setUsed((p) => [...p, idx]);
        setCurrent(RESOURCES_DATA[idx]);
        setSelected([]);
        setFeedback(null);
    }, [used]);

    useEffect(() => {
        next();
    }, []);

    const getUsedResources = () => {
        if (!current) return { budget: 0, time: 0, value: 0 };
        return current.objectives
            .filter((obj) => selected.includes(obj.name))
            .reduce(
                (acc, obj) => ({
                    budget: acc.budget + obj.budgetCost,
                    time: acc.time + obj.timeCost,
                    value: acc.value + obj.value,
                }),
                { budget: 0, time: 0, value: 0 }
            );
    };

    const canSelect = (obj: ResourceObjective) => {
        if (!current) return false;
        const used = getUsedResources();
        return (
            used.budget + obj.budgetCost <= current.budget &&
            used.time + obj.timeCost <= current.time
        );
    };

    const handleToggle = (objName: string) => {
        if (feedback) return;
        if (selected.includes(objName)) {
            setSelected(selected.filter((n) => n !== objName));
        } else {
            const obj = current?.objectives.find((o) => o.name === objName);
            if (obj && canSelect(obj)) {
                setSelected([...selected, objName]);
            }
        }
    };

    const validateSelection = () => {
        if (!current) return;
        const usedRes = getUsedResources();
        const efficiency = usedRes.value / current.optimalValue;

        if (efficiency >= 0.9) {
            setFeedback('success');
            setScore((s) => s + Math.round(usedRes.value));
            setTimeout(() => {
                if (round + 1 >= maxRounds) setPhase('result');
                else {
                    setRound((r) => r + 1);
                    next();
                }
            }, 1200);
        } else if (efficiency >= 0.6) {
            setFeedback('success');
            setScore((s) => s + Math.round(usedRes.value * 0.7));
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
            if (lives <= 1) setTimeout(() => setPhase('result'), 1200);
            else
                setTimeout(() => {
                    setRound((r) => r + 1);
                    next();
                }, 1500);
        }
    };

    const usedRes = getUsedResources();

    if (phase === 'result') {
        return (
            <ResultScreen
                score={score}
                stats={{ 'Rounds': `${round}/${maxRounds}` }}
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
                title="Gestionnaire"
                subtitle="Optimise les ressources"
                onBack={onBack}
                lives={lives}
                score={score}
                progress={(round / maxRounds) * 100}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
                {current && (
                    <>
                        <Card style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>
                                💎 {current.scenario}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                                <div>
                                    <div style={{ color: 'var(--yellow)', fontWeight: 700, fontSize: '1.5rem' }}>
                                        {current.budget - usedRes.budget}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        Budget restant
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--orange)', fontWeight: 700, fontSize: '1.5rem' }}>
                                        {current.time - usedRes.time}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        Temps restant
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1.5rem' }}>
                                        {usedRes.value}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        Valeur
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {current.objectives.map((obj) => {
                                const isSelected = selected.includes(obj.name);
                                const canAdd = !isSelected && canSelect(obj);

                                return (
                                    <button
                                        key={obj.name}
                                        className={`btn-option ${isSelected ? 'correct' : ''}`}
                                        onClick={() => handleToggle(obj.name)}
                                        disabled={(!isSelected && !canAdd) || !!feedback}
                                        style={{
                                            opacity: !isSelected && !canAdd ? 0.5 : 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div>
                                            <span style={{ marginRight: 8 }}>
                                                {isSelected ? '☑' : '☐'}
                                            </span>
                                            {obj.name}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            -{obj.budgetCost}💰 -{obj.timeCost}⏱️ → +{obj.value}✨
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={validateSelection}
                            style={{ marginTop: 24 }}
                            disabled={!!feedback || selected.length === 0}
                        >
                            Valider ma sélection
                        </button>

                        {feedback && (
                            <Feedback
                                type={feedback}
                                message={
                                    feedback === 'success'
                                        ? `Bien joué ! +${usedRes.value} points`
                                        : 'Optimisation insuffisante !'
                                }
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ResourcesGame;
