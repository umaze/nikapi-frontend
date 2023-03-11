import Step from "@/components/Step";
import {useSelector} from "react-redux";
import {selectCurrentActivity} from "@/store/activitySlice";
import {useState} from "react";

export default function ApplyOrders({currentStep, stepsSize}) {
    const activity = useSelector(selectCurrentActivity);
    const rollen = activity.attributes?.gruppe.data.attributes.rollen.map(r => r.name).join(', ');
    const [rollenListe, setRollenListe] = useState([rollen]);
    return (
        <Step title="Tour erstellen" current={currentStep} size={stepsSize}>
            {activity.attributes &&
                <>
                    <p><strong>Einsatztyp</strong>: {activity.attributes.einsatztyp.typ}</p>
                    {rollenListe.map((r, i) => (
                        <p key={i}><strong>Rollen {i + 1}</strong>: {r}</p>
                    ))}
                    <button
                        type="button"
                        onClick={() => setRollenListe([...rollenListe, rollen])}
                        className="btn">+
                    </button>
                </>
            }
        </Step>
    )
}
