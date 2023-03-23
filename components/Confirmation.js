import Step from "@/components/Step";
import Select from "@/components/Select";
import {STATUS_ACTIVITY} from "@/config/index";
import styles from "@/styles/Confirmation.module.scss";
import {useSelector} from "react-redux";
import {selectCurrentDemand} from "@/store/activitySlice";

export default function Confirmation({currentStep, stepsSize, register, errors}) {
    const activityDemand = useSelector(selectCurrentDemand);
    /** Input field component */
    const Input = ({label, required, type, placeholder}) => (
        <div>
            <legend>{label}</legend>
            <input
                {...register(label, {required})}
                className={errors[label] && styles.inputInvalid}
                type={type}
                placeholder={placeholder}
            />
            {errors[label] && <span>mandatory</span>}
        </div>
    );

    const statusOptions = (options) => (
        <>
            {options && options.map((option, i) => (
                <option key={i} defaultValue={options[0]} value={option}>{option}</option>
            ))}
        </>
    );

    return (
        <Step title="Status setzen" current={currentStep} size={stepsSize}>
            <div className={styles.confirmation}>
                <div className={styles.infos}>
                    <p>Datum: <strong>{new Date(activityDemand.attributes.datum).toLocaleDateString('de-CH')}</strong>
                    </p>
                    <p>Einsatztyp: <strong>{activityDemand.attributes.einsatztyp.typ}</strong></p>
                </div>
                <Input label="Bezeichnung" type="text" required placeholder="Kennzeichnung des Einsatzes"/>
                <Input label="Bemerkungen" type="text" placeholder="Spezielles zu beachten, Besonderheiten, ..."/>
                <Select
                    label="Status"
                    required
                    id={`selectStatus`}
                    options={statusOptions(STATUS_ACTIVITY)}
                    register={(name, required) => register(name, {required: required})}
                    errors={errors}/>
            </div>
        </Step>
    )
}
