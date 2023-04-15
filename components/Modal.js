import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import styles from '@/styles/Modal.module.scss';

export default function Modal({ show, onClose, children, title }) {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => setIsBrowser(true));

    const handleClose = (e) => {
        e.preventDefault();
        onClose();
    };

    const modalContent = show ? (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    {title && <h3 className="heading-tertiary">{title}</h3>}
                    <a href="#" onClick={handleClose}>
                        <FaTimes />
                    </a>
                </div>
                {children}
            </div>
        </div>
    ) : null;

    if (isBrowser) {
        return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
    } else {
        return null;
    }
}
