import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string;
};

export const PasswordField = ({ label, id, className, disabled, ...props }: PasswordFieldProps) => {
    const [visible, setVisible] = useState(false);
    const inputId = id ?? props.name;

    return (
        <div className="form-group">
            <label htmlFor={inputId}>{label}</label>
            <div className="password-field">
                <input
                    {...props}
                    id={inputId}
                    type={visible ? 'text' : 'password'}
                    className={['password-field__input', className].filter(Boolean).join(' ')}
                    disabled={disabled}
                />
                <button
                    type="button"
                    className="password-field__toggle"
                    onClick={() => setVisible((current) => !current)}
                    disabled={disabled}
                    aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                    title={visible ? 'Ocultar senha' : 'Mostrar senha'}
                >
                    {visible ? (
                        <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                            <path d="M3 3l18 18" />
                            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                            <path d="M9.9 4.2A9.4 9.4 0 0 1 12 4c5 0 8.2 4 9.5 6.2a3.3 3.3 0 0 1 0 3.6 16 16 0 0 1-2.1 2.8" />
                            <path d="M6.4 6.4a16.2 16.2 0 0 0-3.9 3.8 3.3 3.3 0 0 0 0 3.6C3.8 16 7 20 12 20a9.7 9.7 0 0 0 4.1-.9" />
                        </svg>
                    ) : (
                        <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                            <path d="M2.5 10.2C3.8 8 7 4 12 4s8.2 4 9.5 6.2a3.3 3.3 0 0 1 0 3.6C20.2 16 17 20 12 20s-8.2-4-9.5-6.2a3.3 3.3 0 0 1 0-3.6Z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};
