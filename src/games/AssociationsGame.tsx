import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ResultScreen from '../components/ResultScreen';
import Card from '../components/Card';
import { ASSOCIATION_DATA } from '../data/gameData';
import { pick } from '../utils/helpers';
import { AssociationData } from '../types';

interface AssociationsGameProps {
    onBack: () => void;
    onScore: (score: number) => void;
    isActive: boolean;
}

const AssociationsGame: React.FC<AssociationsGameProps> = ({ onBack, onScore, isActive }) => {
    const [current, setCurrent] = useState<AssociationData | null>(null);
    const [selectedLink, setSelectedLink] = useState<string | null>(null);
    const [round, setRound] = useState(0);
    const [used, setUsed] = useState<number[]>([]);
    const maxRounds = 8;

    const next = useCallback(() => {
        if (!isActive) return;
        const avail = ASSOCIATION_DATA.map((_, i) => i).filter((i) => !used.includes(i));
        if (avail.length === 0) {
            setUsed([]);
            setCurrent(ASSOCIATION_DATA[0]);
            setSelectedLink(null);
            return;
        }
        const idx = pick(avail);
        setUsed((p: number[]) => [...p, idx]);
        setCurrent(ASSOCIATION_DATA[idx]);
        setSelectedLink(null);
    }, [used, isActive]);

    useEffect(() => {
        if (isActive) {
            next();
        } else {
            setRound(0);
            setUsed([]);
            setCurrent(null);
            setSelectedLink(null);
        }
    }, [isActive, next]);

    const handleSelect = (link: string) => {
        if (!isActive || selectedLink) return;
        setSelectedLink(link);
        // All answers are valid in this creative game - it rewards participation
        onScore(25);

        setTimeout(() => {
            setRound((r: number) => r + 1);
            if (isActive) next();
        }, 1200);
    };

    if (!isActive) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            {current && (
                <>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 16,
                            marginBottom: 24,
                            width: '100%',
                            maxWidth: 600
                        }}
                    >
                        <Card style={{ flex: 1, textAlign: 'center', margin: 0 }}>
                            <p style={{ fontSize: '1.3rem', fontWeight: 700 }}>{current.word1}</p>
                        </Card>
                        <span style={{ fontSize: '1.5rem' }}>🔗</span>
                        <Card style={{ flex: 1, textAlign: 'center', margin: 0 }}>
                            <p style={{ fontSize: '1.3rem', fontWeight: 700 }}>{current.word2}</p>
                        </Card>
                    </div>

                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 16 }}>
                        Quel lien te semble le plus pertinent ?
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 500 }}>
                        {current.links.map((link, idx) => (
                            <button
                                key={idx}
                                className={`btn-option ${selectedLink === link ? 'correct' : ''}`}
                                onClick={() => handleSelect(link)}
                                disabled={!!selectedLink}
                            >
                                {link}
                            </button>
                        ))}
                    </div>

                    {selectedLink && (
                        <div
                            className="scaleIn"
                            style={{
                                marginTop: 24,
                                padding: 16,
                                background: 'rgba(34,197,94,0.1)',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid var(--green)',
                                textAlign: 'center',
                                maxWidth: 500
                            }}
                        >
                            <span style={{ fontSize: '1.3rem' }}>💡</span>
                            <p style={{ color: 'var(--green)', marginTop: 8 }}>
                                Belle connexion ! La pensée latérale, ça s'entraîne.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AssociationsGame;
