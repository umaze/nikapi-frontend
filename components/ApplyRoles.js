import Step from "@/components/Step";
import {useSelector} from "react-redux";
import {FaPlus} from 'react-icons/fa';
import {getSelectables, selectCurrentDemand, selectMatchingAvailabilities} from "@/store/activitySlice";
import SelectAvailability from "@/components/SelectAvailability";
import {useEffect, useState} from "react";
import {getRoleNameOfSelectable, getUnselectedRoles} from "@/helpers/index";
import styles from "@/styles/ApplyRoles.module.scss";
import _ from "lodash";

export default function ApplyRoles({currentStep, stepsSize, register, errors, readOnly}) {
    const activityDemand = useSelector(selectCurrentDemand);
    const rollen = activityDemand.attributes?.gruppe.data.attributes.rollen;
    const availabilitiesByRoles = useSelector(selectMatchingAvailabilities(activityDemand.id, rollen));
    const selectablesStore = useSelector(getSelectables);
    const difference = getUnselectedRoles(rollen, selectablesStore);

    const applySelectables = rollen => rollen?.map((rolle, i) => applySelectable(rolle, i));
    const mapSelectables = items => items?.map(item => mapSelectable(item));

    const applySelectable = (rolle, i) => {
        return {
            name: rolle.name,
            selectableId: `${rolle.name.toLowerCase()}_${i}`
        };
    };
    const mapSelectable = item => {
        const name = getRoleNameOfSelectable(item);
        return {
            name: name?.charAt(0).toUpperCase() + name.slice(1),
            selectableId: Object.keys(item)[0]
        };
    };

    const mappedRollen = [...applySelectables(difference), ...mapSelectables(selectablesStore)];
    const sortedRollen = _.orderBy(mappedRollen, ['selectableId'], ['asc']);
    const [selectables, setSelectables] = useState([...sortedRollen]);

    const handleAddSelectable = (item, i) => {
        const rollen = [...selectables, applySelectable(item, i)];
        const sorted = _.orderBy(rollen, ['selectableId'], ['asc']);
        setSelectables(sorted);
    };

    const displayButton = (roleName) => {
        const countAvailabilities = availabilitiesByRoles[roleName]?.length;
        const countSelectsForRoleName = selectables.filter(r => r.name === roleName)?.length;
        return activityDemand.attributes.einsatztyp?.typ.startsWith('Lokal') && countSelectsForRoleName < countAvailabilities;
    };

    return (
        <Step title="Rollen" info="Mitglieder zuweisen" current={currentStep} size={stepsSize}>
            {activityDemand.attributes &&
                <>
                    <div className={styles.infos}>
                        <p>Datum: <strong>{new Date(activityDemand.attributes.datum).toLocaleDateString('de-CH')}</strong>
                        </p>
                        <p>Einsatztyp: <strong>{activityDemand.attributes.einsatztyp.typ}</strong></p>
                        {!rollen.length && <h3 className="heading-tertiary">Keine Rollen verhanden</h3>}
                    </div>

                    {selectables.map((r, i) => (
                        <SelectAvailability key={i} role={r} register={register} errors={errors} readOnly={readOnly}/>
                    ))}
                    {!readOnly && rollen.map((r, i) => (
                        displayButton(r.name) &&
                        <button key={i} className="btn btn-icon" onClick={() => handleAddSelectable(r, i+1)}>
                            <FaPlus/>{r.name} hinzufügen</button>
                    ))}
                </>
            }
        </Step>
    )
}
