import React from 'react';

interface FeedbackProps {
    type: 'success' | 'error' | 'info';
    message: string;
}

const Feedback: React.FC<FeedbackProps> = ({ type, message }) => {
    const colors = { success: 'var(--green)', error: 'var(--red)', info: 'var(--cyan)' };
    const icons = { success: '✓', error: '✗', info: 'ℹ' };

    return (
        <div
            className="scaleIn"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '14px 20px',
                borderRadius: 'var(--radius-md)',
                marginTop: 16,
                background: `${colors[type]}15`,
                border: `2px solid ${colors[type]}`,
                color: colors[type],
                fontWeight: 600,
            }}
        >
            <span style={{ fontSize: '1.3rem' }}>{icons[type]}</span>
            {message}
        </div>
    );
};

export default Feedback;
