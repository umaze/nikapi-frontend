import {useDispatch, useSelector} from "react-redux";
import {addSelectable, selectCurrentDemand, selectMatchingAvailabilities, setRole} from "@/store/activitySlice";
import SelectWrapper from "@/components/SelectWrapper";

export default function SelectAvailability({role, register, errors}) {
    const dispatch = useDispatch();
    const activityDemand = useSelector(selectCurrentDemand);
    const rollen = activityDemand.attributes?.gruppe.data.attributes.rollen;
    const availabilitiesByRoles = useSelector(selectMatchingAvailabilities(activityDemand.id, rollen));

    const getOptionLabel = availability => {
        return availability.benutzer.username;
    };

    const rolleOptions = options => (
        <>
            <option value={0}>{!options || !options.length ? 'Kein Mitglied für Rolle verfügbar' : 'Wähle ein Mitglied...'}</option>
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
        dispatch(addSelectable(state));
    };

    return (
        <>
            <SelectWrapper
                label={role.name}
                required
                id={`activity.select${role.selectableId}`}
                options={rolleOptions(availabilitiesByRoles[role.name])}
                disabled={!availabilitiesByRoles[role.name] || !availabilitiesByRoles[role.name].length}
                register={register}
                handleChange={(e) => handleChange(role.selectableId, e)}
                errors={errors}/>
        </>
    )
}