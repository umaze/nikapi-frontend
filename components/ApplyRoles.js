import Step from "@/components/Step";
import {useSelector} from "react-redux";
import {selectCurrentDemand} from "@/store/activitySlice";
import SelectAvailability from "@/components/SelectAvailability";
import styles from "@/styles/ApplyRoles.module.scss";

export default function ApplyRoles({currentStep, stepsSize, register, errors}) {
    const activityDemand = useSelector(selectCurrentDemand);
    const rollen = activityDemand.attributes?.gruppe.data.attributes.rollen;

    return (
        <Step title="Rollen zuweisen" current={currentStep} size={stepsSize}>
            {activityDemand.attributes &&
                <>
                    <div className={styles.infos}>
                        <p>Datum: <strong>{new Date(activityDemand.attributes.datum).toLocaleDateString('de-CH')}</strong></p>
                        <p>Einsatztyp: <strong>{activityDemand.attributes.einsatztyp.typ}</strong></p>
                        {!rollen.length && <h3 className="heading-tertiary">Keine Rollen verhanden</h3>}
                    </div>

                    {rollen.map((r, i) => (
                        <SelectAvailability key={i} role={r} register={register} errors={errors}/>
                    ))}
                    {rollen.map((r, i) => (
                        <button key={i} className="btn">Weiterer {r.name}</button>
                    ))}
                </>
            }
        </Step>
    )
}
