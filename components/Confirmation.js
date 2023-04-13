import {useSelector} from "react-redux";
import Step from "@/components/Step";
import SelectWrapper from "@/components/SelectWrapper";
import {STATUS_ACTIVITY} from "@/config/index";
import {selectCurrentDemand} from "@/store/activitySlice";
import InputWrapper from "@/components/InputWrapper";
import styles from "@/styles/Confirmation.module.scss";

export default function Confirmation({currentStep, stepsSize, register, errors}) {
    const activityDemand = useSelector(selectCurrentDemand);

    const statusOptions = (options) => (
        <>
            {options && options.map((option, i) => (
                <option key={i} defaultValue={options[0]} value={option}>{option}</option>
            ))}
        </>
    );

    return (
        <Step title="Bestätigung" info="Abschliessende Angaben" current={currentStep} size={stepsSize}>
            <div className={styles.confirmation}>
                <div className={styles.infos}>
                    <p>Datum: <strong>{new Date(activityDemand.attributes.datum).toLocaleDateString('de-CH')}</strong>
                    </p>
                    <p>Einsatztyp: <strong>{activityDemand.attributes.einsatztyp.typ}</strong></p>
                </div>
                <InputWrapper
                    label="Bezeichnung"
                    type="text"
                    required
                    placeholder="Kennzeichnung des Einsatzes"
                    register={register}
                    errors={errors} />
                <InputWrapper
                    label="Bemerkungen"
                    type="text"
                    placeholder="Spezielles zu beachten, Besonderheiten, ..."
                    register={register}
                    errors={errors} />
                <SelectWrapper
                    label="Status"
                    required
                    id="selectStatus"
                    options={statusOptions(STATUS_ACTIVITY)}
                    register={register}
                    errors={errors}/>
            </div>
        </Step>
    )
}
