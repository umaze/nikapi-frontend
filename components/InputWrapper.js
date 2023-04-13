import styles from "@/styles/InputWrapper.module.scss";

export default function InputWrapper({label, type, required, placeholder, register, errors}) {
    return (
        <div className={styles.wrapper}>
            <label>{label}</label>
            <div className={styles.inputField}>
                <input
                    {...register(label, {required})}
                    className={errors[label] && styles.inputInvalid}
                    type={type}
                    placeholder={placeholder}
                />
                {errors[label] && <span>!</span>}
            </div>
        </div>
    )
}
