import styles from "@/styles/InputWrapper.module.scss";

export default function InputWrapper({label, type, required, disabled, id, placeholder, register, errors}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.inputField}>
                <input
                    {...register(id, {required})}
                    className={errors[label] && styles.inputInvalid}
                    id={id}
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    required={required}
                    min="0"
                />
                {errors[label] && <span>!</span>}
            </div>
            <label htmlFor={id}>{label}</label>
        </div>
    )
}
