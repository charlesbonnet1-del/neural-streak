import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    streak: number;
    totalScore: number;
    isPremium: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => void;
    updateScore: (score: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking auth check from localStorage or cookie
        const saved = localStorage.getItem('neural_user_auth');
        if (saved) {
            setUser(JSON.parse(saved));
        }
        setLoading(false);
    }, []);

    const login = async () => {
        // Simulated login
        const mockUser: User = {
            id: '1',
            name: 'Utilisateur Code',
            email: 'user@example.com',
            streak: 0,
            totalScore: 0,
            isPremium: false,
        };
        setUser(mockUser);
        localStorage.setItem('neural_user_auth', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('neural_user_auth');
    };

    const updateScore = async (score: number) => {
        if (!user) return;
        const updatedUser = { ...user, totalScore: user.totalScore + score };
        setUser(updatedUser);
        localStorage.setItem('neural_user_auth', JSON.stringify(updatedUser));
        // In a real app, you would call your backend API here
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateScore }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
