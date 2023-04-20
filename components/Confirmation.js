import {useSelector} from "react-redux";
import Step from "@/components/Step";
import SelectWrapper from "@/components/SelectWrapper";
import {STATUS_ACTIVITY} from "@/config/index";
import {selectCurrentDemand} from "@/store/activitySlice";
import InputWrapper from "@/components/InputWrapper";
import {getOptions} from "@/helpers/index";
import styles from "@/styles/Confirmation.module.scss";

export default function Confirmation({currentStep, stepsSize, register, errors, readOnly}) {
    const activityDemand = useSelector(selectCurrentDemand);

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
                    id="activity.bezeichnung"
                    type="text"
                    required
                    placeholder="Kennzeichnung des Einsatzes"
                    register={register}
                    disabled={readOnly}
                    errors={errors} />
                <InputWrapper
                    label="Bemerkungen"
                    id="activity.bemerkung"
                    type="text"
                    placeholder="Spezielles zu beachten, Besonderheiten, ..."
                    register={register}
                    disabled={readOnly}
                    errors={errors} />
                <SelectWrapper
                    label="Status"
                    required
                    id="activity.selectStatus"
                    options={getOptions(STATUS_ACTIVITY)}
                    register={register}
                    disabled={readOnly}
                    errors={errors}/>
            </div>
        </Step>
    )
}
