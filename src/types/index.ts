export type Color = 'cyan' | 'magenta' | 'yellow' | 'purple' | 'orange' | 'green';

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    stat: string;
    statDesc: string;
    games: string[];
}

export interface GameInfo {
    name: string;
    desc: string;
    icon: string;
}

export interface HallucinationData {
    text: string;
    hasError: boolean;
    error?: string;
}

export interface FallacyData {
    text: string;
    fallacy: string;
    options: string[];
}

export interface TrilemmaData {
    statement: string;
    answer: 'true' | 'false' | 'unknown';
}

export interface HumanAiData {
    text: string;
    author: 'human' | 'ai';
}

export interface CausalData {
    event: string;
    steps: string[];
}

export interface SyntaxData {
    fragments: string[];
    correct: number[];
}

export interface ClicheData {
    text: string;
    hasCliche: boolean;
    cliches?: string[];
}

export interface MetaphorData {
    concept: string;
    options: string[];
    best: number;
}

export interface SequenceData {
    title: string;
    steps: string[];
}

export interface AssociationData {
    word1: string;
    word2: string;
    links: string[];
}

export interface UchroniaData {
    scenario: string;
    consequences: string[];
    absurd: string;
}
