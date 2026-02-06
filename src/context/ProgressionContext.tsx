import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameScore {
    gameId: string;
    categoryId: string;
    score: number;
    timestamp: number;
}

interface ProgressionContextType {
    scores: GameScore[];
    addScore: (gameId: string, categoryId: string, score: number) => void;
    getCategoryPerformance: (categoryId: string) => number;
    getWeakestCategory: () => string | null;
}

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

export const ProgressionProvider = ({ children }: { children: React.ReactNode }) => {
    const [scores, setScores] = useState<GameScore[]>([]);

    useEffect(() => {
        const savedScores = localStorage.getItem('neural_scores');
        if (savedScores) {
            setScores(JSON.parse(savedScores));
        }
    }, []);

    const addScore = (gameId: string, categoryId: string, score: number) => {
        const newScore: GameScore = {
            gameId,
            categoryId,
            score,
            timestamp: Date.now(),
        };
        const updatedScores = [...scores, newScore];
        setScores(updatedScores);
        localStorage.setItem('neural_scores', JSON.stringify(updatedScores));
    };

    const getCategoryPerformance = (categoryId: string) => {
        const catScores = scores.filter((s: GameScore) => s.categoryId === categoryId);
        if (catScores.length === 0) return 0;
        const total = catScores.reduce((acc: number, s: GameScore) => acc + s.score, 0);
        return total / catScores.length;
    };

    const getWeakestCategory = () => {
        const categories = Array.from(new Set(scores.map((s: GameScore) => s.categoryId))) as string[];
        if (categories.length === 0) return null;

        let weakest = categories[0];
        let minPerf = getCategoryPerformance(weakest);

        categories.forEach((cat: string) => {
            const perf = getCategoryPerformance(cat);
            if (perf < minPerf) {
                minPerf = perf;
                weakest = cat;
            }
        });

        return weakest;
    };

    return (
        <ProgressionContext.Provider value={{ scores, addScore, getCategoryPerformance, getWeakestCategory }}>
            {children}
        </ProgressionContext.Provider>
    );
};

export const useProgression = () => {
    const context = useContext(ProgressionContext);
    if (context === undefined) {
        throw new Error('useProgression must be used within a ProgressionProvider');
    }
    return context;
};
