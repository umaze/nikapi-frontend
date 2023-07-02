import styles from "@/styles/SelectWrapper.module.scss";

export default function SelectWrapper({label, required, disabled, id, options, register, handleChange, errors}) {
    const isDisabled = disabled || !options || (Array.isArray(options) && !options.length);
    return (
        <div className={styles.wrapper}>
            <div className={styles.customSelect}>
                <select
                    {...register(id, {required})}
                    className={errors[label] && styles.inputInvalid}
                    id={id}
                    autoComplete="off"
                    onChange={handleChange}
                    required={required && !isDisabled}
                    disabled={isDisabled}>
                    {options}
                </select>
                {errors[label] && <span>mandatory</span>}
            </div>
            <label htmlFor={id}>{label}</label>
        </div>
    )
}
