import React from 'react';

interface StatProps {
    label: string;
    value: string | number;
    color?: string;
}

const Stat: React.FC<StatProps> = ({ label, value, color }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: color || 'var(--text-primary)' }}>{value}</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</div>
    </div>
);

export default Stat;
