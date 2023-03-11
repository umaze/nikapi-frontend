import styles from "@/styles/Activities.module.scss";

export default function Select({label, required, id, options, register, handleChange, errors}) {
    return (
        <div>
            <legend>{label}</legend>
            <select
                {...register(label, {required})}
                className={errors[label] && styles.inputInvalid}
                id={id}
                autoComplete="off"
                onChange={handleChange}>
                {options}
            </select>
            {errors[label] && <span>mandatory</span>}
        </div>
    )
}
