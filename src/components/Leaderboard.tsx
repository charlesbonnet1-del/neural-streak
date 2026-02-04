import React from 'react';
import Card from './Card';
import Header from './Header';

interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    streak: number;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: "NeuralMaster", score: 12500, streak: 15 },
    { rank: 2, name: "BrainHacker", score: 10200, streak: 8 },
    { rank: 3, name: "CognitiveFocus", score: 9800, streak: 12 },
    { rank: 4, name: "SynapseJunky", score: 8500, streak: 4 },
    { rank: 5, name: "LogicLover", score: 7200, streak: 6 },
];

const Leaderboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="Leaderboard Mondial" onBack={onBack} />
            <div style={{ padding: 20, maxWidth: 500, margin: '0 auto', width: '100%' }}>
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>RANG</th>
                                <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>JOUEUR</th>
                                <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>SCORE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_LEADERBOARD.map((entry) => (
                                <tr key={entry.rank} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            background: entry.rank === 1 ? 'var(--yellow)' : entry.rank === 2 ? '#C0C0C0' : entry.rank === 3 ? '#CD7F32' : 'var(--bg-elevated)',
                                            color: entry.rank <= 3 ? 'var(--bg-deep)' : 'var(--text-secondary)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>
                                            {entry.rank}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ fontWeight: 600 }}>{entry.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--orange)' }}>🔥 {entry.streak} jours</div>
                                    </td>
                                    <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: 'var(--cyan)' }}>
                                        {entry.score.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Connecte-toi pour apparaître dans le classement !
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
