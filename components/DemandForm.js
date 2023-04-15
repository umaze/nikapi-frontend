import InputWrapper from "@/components/InputWrapper";
import SelectWrapper from "@/components/SelectWrapper";
import {getOptions} from "@/helpers/index";
import {EINSATZTYP_ALL} from "@/config/index";
import {useEffect} from "react";
import styles from "@/styles/DemandForm.module.scss";

export default function DemandForm({register, errors, demand, demandGroups, setValue}) {
    const demandGroupOptions = options => (
        <>
            <option value="" hidden>Wähle eine Gruppe...</option>
            {options && options.map((option, i) => (
                <option key={i} value={option.id}>{option.attributes.name}</option>
            ))}
        </>
    );

    useEffect(() => {
        if (demand) {
            setValue('demand', {
                beschreibung: demand.beschreibung,
                datum: demand.datum,
                selectGruppe: demand.gruppe,
                zeitVon: demand.zeitVon,
                zeitBis: demand.zeitBis,
                selectEinsatztyp: demand.einsatztyp?.typ
            });
        }
    }, []);

    return (
        <>
            <div className={`container grid grid--2-cols ${styles.demand}`}>
                <div className={styles.gridSpan2}>
                    <SelectWrapper
                        label="Gruppe"
                        required
                        id="demand.selectGruppe"
                        options={demandGroupOptions(demandGroups)}
                        register={register}
                        errors={errors}/>
                </div>
                <InputWrapper
                    label="Datum"
                    id="demand.datum"
                    type="date"
                    required
                    placeholder=""
                    register={register}
                    errors={errors}/>
                <div className={`grid grid--2-cols ${styles.range}`}>
                    <InputWrapper
                        label="Zeit von"
                        id="demand.zeitVon"
                        type="time"
                        placeholder=""
                        register={register}
                        errors={errors}/>
                    <InputWrapper
                        label="Zeit bis"
                        id="demand.zeitBis"
                        type="time"
                        placeholder=""
                        register={register}
                        errors={errors}/>
                </div>
                <SelectWrapper
                    label="Einsatztyp"
                    required
                    id="demand.selectEinsatztyp"
                    options={getOptions(EINSATZTYP_ALL)}
                    register={register}
                    errors={errors}/>
                <div className={styles.gridSpan2}>
                    <InputWrapper
                        label="Beschreibung"
                        id="demand.beschreibung"
                        type="text"
                        placeholder="Angaben zur Veranstaltung"
                        register={register}
                        errors={errors}/>
                </div>
            </div>
        </>
    );
}
