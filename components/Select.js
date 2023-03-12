import styles from "@/styles/Activities.module.scss";

export default function Select({label, required, disabled, id, options, register, handleChange, errors}) {
    return (
        <div>
            <legend>{label}</legend>
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
    )
}
