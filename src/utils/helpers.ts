export const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const pickN = <T>(arr: T[], n: number): T[] => shuffle(arr).slice(0, n);

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));
