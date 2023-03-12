import Step from "@/components/Step";
import {useSelector} from "react-redux";
import {selectCurrentDemand} from "@/store/activitySlice";

export default function ApplyOrders({currentStep, stepsSize, register, errors}) {
    const activityDemand = useSelector(selectCurrentDemand);
    const einsatztyp = activityDemand.attributes.einsatztyp.typ;

    const auftragRequired = Array.of('Hausbesuch', 'Schulbesuch').some(t => t === einsatztyp);

    return (
        <Step title="Aufträge zuweisen" current={currentStep} size={stepsSize}>
            {activityDemand.attributes &&
                <>
                    <p><strong>Einsatztyp</strong>: {einsatztyp}</p>
                    {!auftragRequired && <p>Auftr&auml;ge für Typ '{einsatztyp}' <strong>nicht erforderlich</strong></p>}
                </>
            }
        </Step>
    )
}
