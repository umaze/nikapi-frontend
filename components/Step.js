import {IconQuestionMark, IconCheck} from '@tabler/icons-react';
import styles from "@/styles/Step.module.scss";
import {useSelector} from "react-redux";
import {getSteps} from "@/store/activitySlice";

export default function Step({ title, info, current, size, children }) {
    const steps = useSelector(getSteps);

    return (
        <section className={styles.inputGroup}>
            <div className={styles.stepHeading}>
                <div className={styles.stepCombo}>
                    <div className={styles.stepStatus}>
                        <div className={styles.stepInfoSmall}><strong>{current}</strong> / {size}</div>
                        <div className={styles.stepCircle}>
                            <div className={styles.stepNumber}>{steps[(current)] ? <IconCheck/> : <IconQuestionMark/>}</div>
                        </div>
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
