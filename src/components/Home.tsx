import React from 'react';
import Card from './Card';
import Stat from './Stat';
import { CATEGORIES, GAMES } from '../data/gameData';
import { Category } from '../types';

interface HomeProps {
    onSelectGame: (gameId: string) => void;
    onLogin: () => void;
    userStats: {
        streak: number;
        totalScore: number;
    };
    isLoggedIn: boolean;
}


const Home: React.FC<HomeProps> = ({ onSelectGame, onLogin, userStats, isLoggedIn }) => {

    return (
        <div style={{ padding: '40px 20px', maxWidth: 600, margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: 40 }} className="fadeIn">
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8 }}>
                    NEURAL STREAK
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Réentraîne ton cerveau face aux modèles d'IA
                </p>
            </header>

            <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}
                className="scaleIn"
            >
                <Card style={{ margin: 0, textAlign: 'center', padding: 16 }}>
                    <Stat label="FLAMME" value={`🔥 ${userStats.streak}`} color="var(--orange)" />
                </Card>
                <Card style={{ margin: 0, textAlign: 'center', padding: 16 }}>
                    <Stat label="SCORE TOTAL" value={userStats.totalScore} color="var(--cyan)" />
                </Card>
            </div>

            <div style={{ marginBottom: 32, textAlign: 'center' }} className="fadeIn">
                {!isLoggedIn && (
                    <button onClick={onLogin} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                        👤 Connexion
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {CATEGORIES.map((cat, idx) => (
                    <div key={cat.id} className="fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: 12,
                                marginBottom: 16,
                                paddingLeft: 8,
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{cat.name}</h2>
                            <div
                                style={{
                                    marginLeft: 'auto',
                                    textAlign: 'right',
                                    fontSize: '0.8rem',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                <span style={{ color: 'var(--red)', fontWeight: 700 }}>{cat.stat}</span>
                                <br />
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{cat.statDesc}</span>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                            {cat.games.map((gid) => {
                                const g = GAMES[gid];
                                if (!g) return null;
                                return (
                                    <button
                                        key={gid}
                                        onClick={() => onSelectGame(gid)}
                                        className="glass"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            gap: 8,
                                            padding: 16,
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>{g.icon}</span>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{g.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{g.desc}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
