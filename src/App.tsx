import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import { useAuth } from './context/AuthContext';
import SequenceGame from './games/SequenceGame';
import NBackGame from './games/NBackGame';
import ChunkingGame from './games/ChunkingGame';
import UpdatingGame from './games/UpdatingGame';
import HallucinationGame from './games/HallucinationGame';
import FallacyGame from './games/FallacyGame';
import TrilemmaGame from './games/TrilemmaGame';
import HumanAiGame from './games/HumanAiGame';
import CausalGame from './games/CausalGame';
import RecallGame from './games/RecallGame';
import ConstraintsGame from './games/ConstraintsGame';
import SyntaxGame from './games/SyntaxGame';
import ClicheGame from './games/ClicheGame';
import MetaphorGame from './games/MetaphorGame';
import SequencingGame from './games/SequencingGame';
import ResourcesGame from './games/ResourcesGame';
import AssociationsGame from './games/AssociationsGame';
import UchroniaGame from './games/UchroniaGame';
import ReactionGame from './games/ReactionGame';
import FocusGame from './games/FocusGame';

const App: React.FC = () => {
    const [currentGame, setCurrentGame] = useState<string | null>(null);
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
    const { user, login } = useAuth();
    const [userStats, setUserStats] = useState({ streak: 0, totalScore: 0 });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('neural_user') || '{"streak":0, "totalScore":0}');
        setUserStats(user ? { streak: user.streak, totalScore: user.totalScore } : saved);
    }, [currentGame, user]);

    const renderGame = () => {
        switch (currentGame) {
            case 'sequence':
                return <SequenceGame onBack={() => setCurrentGame(null)} />;
            case 'nback':
                return <NBackGame onBack={() => setCurrentGame(null)} />;
            case 'chunking':
                return <ChunkingGame onBack={() => setCurrentGame(null)} />;
            case 'updating':
                return <UpdatingGame onBack={() => setCurrentGame(null)} />;
            case 'hallucination':
                return <HallucinationGame onBack={() => setCurrentGame(null)} />;
            case 'fallacy':
                return <FallacyGame onBack={() => setCurrentGame(null)} />;
            case 'trilemma':
                return <TrilemmaGame onBack={() => setCurrentGame(null)} />;
            case 'humanai':
                return <HumanAiGame onBack={() => setCurrentGame(null)} />;
            case 'causal':
                return <CausalGame onBack={() => setCurrentGame(null)} />;
            case 'recall':
                return <RecallGame onBack={() => setCurrentGame(null)} />;
            case 'constraints':
                return <ConstraintsGame onBack={() => setCurrentGame(null)} />;
            case 'syntax':
                return <SyntaxGame onBack={() => setCurrentGame(null)} />;
            case 'cliche':
                return <ClicheGame onBack={() => setCurrentGame(null)} />;
            case 'metaphor':
                return <MetaphorGame onBack={() => setCurrentGame(null)} />;
            case 'sequencing':
                return <SequencingGame onBack={() => setCurrentGame(null)} />;
            case 'resources':
                return <ResourcesGame onBack={() => setCurrentGame(null)} />;
            case 'associations':
                return <AssociationsGame onBack={() => setCurrentGame(null)} />;
            case 'uchronia':
                return <UchroniaGame onBack={() => setCurrentGame(null)} />;
            case 'reaction':
                return <ReactionGame onBack={() => setCurrentGame(null)} />;
            case 'focus':
                return <FocusGame onBack={() => setCurrentGame(null)} />;
            default:
                return (
                    <div
                        style={{
                            padding: '40px 20px',
                            textAlign: 'center',
                            color: 'var(--text-secondary)',
                            marginTop: 100,
                        }}
                    >
                        Ce jeu ({currentGame}) est en cours de développement...
                        <br />
                        <button
                            onClick={() => setCurrentGame(null)}
                            className="btn btn-secondary"
                            style={{ marginTop: 20 }}
                        >
                            Retour
                        </button>
                    </div>
                );
        }
    };

    if (isLeaderboardOpen) {
        return <Leaderboard onBack={() => setIsLeaderboardOpen(false)} />;
    }

    return (
        <div className="app-container">
            <div className="grid-bg"></div>
            <main style={{ position: 'relative', zIndex: 1 }}>
                {!currentGame ? (
                    <Home
                        userStats={userStats}
                        onSelectGame={setCurrentGame}
                        onViewLeaderboard={() => setIsLeaderboardOpen(true)}
                        onLogin={login}
                        isLoggedIn={!!user}
                    />
                ) : (
                    renderGame()
                )}
            </main>
        </div>
    );
};

export default App;

