import React from 'react';

interface OptionBtnProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    correct?: boolean | string | null;
    wrong?: boolean | string | null;
    selected?: boolean;
    style?: React.CSSProperties;
}

const OptionBtn: React.FC<OptionBtnProps> = ({ children, onClick, disabled, correct, wrong, style = {} }) => {
    let cls = 'btn-option';
    if (correct) cls += ' correct';
    if (wrong) cls += ' wrong';

    return (
        <button
            className={cls}
            onClick={onClick}
            disabled={disabled}
            style={{ ...style, opacity: disabled && !correct && !wrong ? 0.5 : 1 }}
        >
            {children}
        </button>
    );
};

export default OptionBtn;
