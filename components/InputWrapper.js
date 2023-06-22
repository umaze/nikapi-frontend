import styles from "@/styles/InputWrapper.module.scss";

export default function InputWrapper({label, type, required, disabled, id, placeholder, register, errors}) {
    return (
        <div className={styles.wrapper}>
            <label>{label}</label>
            <div className={styles.inputField}>
                <input
                    {...register(id, {required})}
                    className={errors[label] && styles.inputInvalid}
                    id={id}
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    min="0"
                />
                {errors[label] && <span>!</span>}
            </div>
        </div>
    )
}
