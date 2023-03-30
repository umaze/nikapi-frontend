import {IconQuestionMark} from '@tabler/icons-react';
import styles from "@/styles/Step.module.scss";

export default function Step({ title, info, current, size, children }) {
    return (
        <section className={styles.inputGroup}>
            <div className={styles.stepHeading}>
                <div className={styles.stepCombo}>
                    <div className={styles.stepCircle}>
                        <div className={styles.stepNumber}><IconQuestionMark/></div>
                    </div>
                    <div className={styles.stepDescription}>
                        <div className={styles.stepDescriptionTitle}>{title}</div>
                        <div className={styles.stepDescriptionInfo}>{info}</div>
                    </div>
                </div>
                <div className={styles.stepInfo}>Schritt <strong>{current}</strong> / {size}</div>
            </div>
            {children}
        </section>
    )
}
