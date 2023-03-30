import styles from "@/styles/SelectWrapper.module.scss";

export default function SelectWrapper({label, required, disabled, id, options, register, handleChange, errors}) {
    return (
        <div className={styles.wrapper}>
            <label>{label}</label>
            <div className={styles.customSelect}>
                <select
                    {...register(id, {required})}
                    className={errors[label] && styles.inputInvalid}
                    id={id}
                    autoComplete="off"
                    onChange={handleChange}
                    disabled={disabled || !options || (Array.isArray(options) && !options.length)}>
                    {options}
                </select>
                {errors[label] && <span>mandatory</span>}
            </div>
        </div>
    )
}
