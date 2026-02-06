import React, { useState, useEffect, useCallback } from 'react';
import Home from './components/Home';
import { useAuth } from './context/AuthContext';
import { ProgressionProvider } from './context/ProgressionContext';
import GameContainer from './components/GameContainer';
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
    const [currentGame, setCurrentGame] = useState<string | null>(null);
    const { user, login } = useAuth();
    const [userStats, setUserStats] = useState({ streak: 0, totalScore: 0 });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('neural_user') || '{"streak":0, "totalScore":0}');
        setUserStats(user ? { streak: user.streak, totalScore: user.totalScore } : saved);
    }, [currentGame, user]);

    const renderGame = () => {
        if (!currentGame) return null;

        const components: Record<string, React.FC<any>> = {
            sequence: SequenceGame,
            nback: NBackGame,
            chunking: ChunkingGame,
            updating: UpdatingGame,
            hallucination: HallucinationGame,
            fallacy: FallacyGame,
            trilemma: TrilemmaGame,
            humanai: HumanAiGame,
            causal: CausalGame,
            recall: RecallGame,
            constraints: ConstraintsGame,
            syntax: SyntaxGame,
            cliche: ClicheGame,
            metaphor: MetaphorGame,
            sequencing: SequencingGame,
            resources: ResourcesGame,
            associations: AssociationsGame,
            uchronia: UchroniaGame,
            reaction: ReactionGame,
            focus: FocusGame,
        };

        const GameComponent = components[currentGame];

        if (!GameComponent) {
            return (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', marginTop: 100 }}>
                    Ce jeu ({currentGame}) est en cours de développement...
                    <br />
                    <button onClick={() => setCurrentGame(null)} className="btn btn-secondary" style={{ marginTop: 20 }}>
                        Retour
                    </button>
                </div>
            );
        }

        return (
            <GameContainer gameId={currentGame} onBack={() => setCurrentGame(null)}>
                {({ onScore, isActive }: { onScore: (s: number) => void; isActive: boolean }) => (
                    <GameComponent onScore={onScore} isActive={isActive} onBack={() => setCurrentGame(null)} />
                )}
            </GameContainer>
        );
    };



    return (
        <ProgressionProvider>
            <div className="app-container">
                <div className="grid-bg"></div>
                <main style={{ position: 'relative', zIndex: 1 }}>
                    {!currentGame ? (
                        <Home
                            userStats={userStats}
                            onSelectGame={setCurrentGame}
                            onLogin={login}
                            isLoggedIn={!!user}
                        />
                    ) : (
                        renderGame()
                    )}
                </main>
            </div>
        </ProgressionProvider>
    );
};

export default App;
