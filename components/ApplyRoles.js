import Step from "@/components/Step";
import {useSelector} from "react-redux";
import {selectCurrentDemand} from "@/store/activitySlice";
import SelectAvailability from "@/components/SelectAvailability";

export default function ApplyRoles({currentStep, stepsSize, register, errors}) {
    const activityDemand = useSelector(selectCurrentDemand);
    const rollen = activityDemand.attributes?.gruppe.data.attributes.rollen;

    return (
        <Step title="Rollen zuweisen" current={currentStep} size={stepsSize}>
            {activityDemand.attributes &&
                <>
                    <p><strong>Einsatztyp</strong>: {activityDemand.attributes.einsatztyp.typ}</p>
                    {!rollen.length && <h3 className="heading-tertiary">Keine Rollen verhanden</h3>}
                    {rollen.map((r, i) => (
                        <SelectAvailability key={i} role={r} register={register} errors={errors}/>
                    ))}
                </>
            }
        </Step>
    )
}
