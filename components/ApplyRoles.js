import Step from "@/components/Step";
import {useDispatch, useSelector} from "react-redux";
import {getRoles, selectCurrentDemand, selectMatchingAvailabilities, setRole} from "@/store/activitySlice";
import Select from "@/components/Select";
import {useEffect, useState} from "react";

export default function ApplyRoles({currentStep, stepsSize, register, errors}) {
    const [selectedRoles, setSelectedRoles] = useState({});
    const dispatch = useDispatch();
    const activityDemand = useSelector(selectCurrentDemand);
    const activityRoles = useSelector(getRoles);
    const rollen = activityDemand.attributes?.gruppe.data.attributes.rollen;
    const availabilitiesByRoles = useSelector(selectMatchingAvailabilities(activityDemand.id, rollen));
    // console.log(JSON.stringify(availabilitiesByRoles));
    //         activity.attributes.demand.data.id,
    //         activity.attributes?.gruppe.data.attributes.rollen

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

    const handleChange = (rolleName, event) => {
        const state = {};
        const prop = rolleName?.toLowerCase();
        state[prop] = event.target.value;
        dispatch(setRole(state));
    };
    const SelectWrapper = ({role, availabilities}) => (
        <Select
            label={role.name}
            required
            id={'select' + role.name}
            value={selectedRoles[role.name]}
            options={rolleOptions(availabilities)}
            disabled={!availabilities || !availabilities.length}
            register={(name, required) => register(name, {required: required})}
            handleChange={(e) => handleChange(role.name, e)}
            errors={errors}/>
    );

    useEffect(() => {
        setSelectedRoles({
            ...activityRoles
        });
    }, [activityRoles]);

    return (
        <Step title="Rollen zuweisen" current={currentStep} size={stepsSize}>
            {activityDemand.attributes &&
                <>
                    <p><strong>Einsatztyp</strong>: {activityDemand.attributes.einsatztyp.typ}</p>
                    {!rollen.length && <h3 className="heading-tertiary">Keine Rollen verhanden</h3>}
                    {rollen.map((r, i) => (
                        <SelectWrapper key={i} role={r} availabilities={availabilitiesByRoles[r.name]}/>
                    ))}
                </>
            }
        </Step>
    )
}
