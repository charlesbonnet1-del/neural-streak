import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import SequenceGame from './games/SequenceGame';
import NBackGame from './games/NBackGame';
import ChunkingGame from './games/ChunkingGame';
import UpdatingGame from './games/UpdatingGame';
import HallucinationGame from './games/HallucinationGame';
import FallacyGame from './games/FallacyGame';
import TrilemmaGame from './games/TrilemmaGame';
import HumanAiGame from './games/HumanAiGame';
import CausalGame from './games/CausalGame';



const App: React.FC = () => {
    const [currentGame, setCurrentGame] = useState<string | null>(null);
    const [userStats, setUserStats] = useState({ streak: 0, totalScore: 0 });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('neural_user') || '{"streak":0, "totalScore":0}');
        setUserStats(saved);
    }, [currentGame]);

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

    return (
        <div className="app-container">
            <div className="grid-bg"></div>
            <main style={{ position: 'relative', zIndex: 1 }}>
                {!currentGame ? (
                    <Home userStats={userStats} onSelectGame={setCurrentGame} />
                ) : (
                    renderGame()
                )}
            </main>
        </div>
    );
};

export default App;
