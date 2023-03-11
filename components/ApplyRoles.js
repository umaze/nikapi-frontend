import Step from "@/components/Step";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentDemand, selectMatchingAvailabilities, setRole} from "@/store/activitySlice";
import {useState} from "react";
import Select from "@/components/Select";

export default function ApplyRoles({currentStep, stepsSize, register, errors}) {
    const dispatch = useDispatch();
    const demand = useSelector(selectCurrentDemand);
    // useSelector selectMatchingAvailabilities(demand, rolle);
    const availabilitiesSchmutzli = useSelector(selectMatchingAvailabilities(demand.id, 'Schmutzli'));
    // console.log(JSON.stringify(availabilitiesSchmutzli));
    //         activity.attributes.demand.data.id,
    //         activity.attributes?.gruppe.data.attributes.rollen
    const rollen = demand.attributes?.gruppe.data.attributes.rollen.map(r => r.name).join(', ');
    const [rollenListe, setRollenListe] = useState([rollen]);

    const getOptionLabel = availability => {
        return availability.benutzer.username;
    };

    const rolleOptions = options => (
        <>
            <option value={0} hidden>{!options || !options.length ? 'Kein Mitglied für Rolle verfügbar' : 'Wähle ein Mitglied...'}</option>
            {options && options.map((option, i) => (
                <option key={i} value={option.id}>{getOptionLabel(option)}</option>
            ))}
        </>
    );

    const handleChangeSchmutzli = event => {
        dispatch(
            setRole({
                schmutzli: event.target.value
            })
        );
    };

    return (
        <Step title="Rollen zuweisen" current={currentStep} size={stepsSize}>
            {demand.attributes &&
                <>
                    <p><strong>Einsatztyp</strong>: {demand.attributes.einsatztyp.typ}</p>
                    {rollenListe.map((r, i) => (
                        <p key={i}><strong>Rollen {i + 1}</strong>: {r}</p>
                    ))}
                    <Select
                        label="Schmutzli"
                        required
                        id="selectSchmutzli"
                        options={rolleOptions(availabilitiesSchmutzli)}
                        disabled={!availabilitiesSchmutzli || !availabilitiesSchmutzli.length}
                        register={(name, required) => register(name, {required: required})}
                        handleChange={e => handleChangeSchmutzli(e)}
                        errors={errors}/>
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
