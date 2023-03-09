import styles from "@/styles/Step.module.scss";

export default function Step({ title, current, size, children }) {
    return (
        <section className={styles.inputGroup}>
            <div className={styles.stepHeading}>
                <h3 className="heading-tertiary">{title}</h3>
                <div className={styles.stepInfo}>Schritt <strong>{current}</strong> / {size}</div>
            </div>
            {children}
        </section>
    )
}
