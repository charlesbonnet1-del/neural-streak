import React from 'react';

interface CardProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, style = {}, className = "" }) => (
    <div className={`glass fadeIn ${className}`} style={{ padding: 24, margin: '0 20px', ...style }}>
        {children}
    </div>
);

export default Card;
