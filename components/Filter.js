import {useForm} from "react-hook-form";
import SelectWrapper from "@/components/SelectWrapper";
import InputWrapper from "@/components/InputWrapper";
import {FILTER_TYPE} from "@/config/index";
import {IconFilter, IconFilterOff} from "@tabler/icons-react";
import styles from "@/styles/Filter.module.scss";
import {useState} from "react";

export default function Filter({type, demandGroups, listEinsatztyp, listRolle, listStatus, doFilter, isExpanded, doCollapse}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const onSubmit = async data => {
        let criteria = {};
        Object.entries(data.filter).forEach(([k, v]) => {
            if (!!v) {
                criteria[k] = v;
            }
        });
        doFilter(criteria);
    };
    const onReset = () => {
        reset({
            filter: {
                selectDemandGroup: "",
                datum: "",
                selectRolle: "",
                selectEinsatztyp: "",
                selectStatus: "",
                benutzer: "",
                adresse: "",
                bezeichnung: "",
                bestellung: ""
            }
        });
        doFilter({});
    };

    const demandGroupOptions = options => (
        <>
            <option value=""></option>
            {options && options.map((option, i) => (
                <option key={i} value={option.id}>{option.attributes.name}</option>
            ))}
        </>
    );

    const stringOptions = (options, emptyLabel = '') => (
        <>
            <option value="">{emptyLabel}</option>
            {options && options.map((option, i) => (
                <option key={i} value={option}>{option}</option>
            ))}
        </>
    );

    return (
        isExpanded &&
        <div>
            <form className={`form ${styles.filter}`} onSubmit={handleSubmit(onSubmit)}>
                {type === FILTER_TYPE[0] &&
                    <SelectWrapper
                        label="Gruppe"
                        id="filter.selectDemandGroup"
                        options={demandGroupOptions(demandGroups)}
                        register={register}
                        errors={errors}/>}
                <InputWrapper
                    label="Datum"
                    id="filter.datum"
                    type="date"
                    placeholder=""
                    register={register}
                    errors={errors}/>
                {type === FILTER_TYPE[1] &&
                    <InputWrapper
                        label="Name Mitglied"
                        id="filter.benutzer"
                        type="text"
                        placeholder=""
                        register={register}
                        errors={errors}/>}
                {type === FILTER_TYPE[2] &&
                    <>
                        <InputWrapper
                            label="Bezeichnung"
                            id="filter.bezeichnung"
                            type="text"
                            placeholder="z.B. Familienname"
                            register={register}
                            errors={errors}/>
                        <InputWrapper
                            label="Adresse"
                            id="filter.adresse"
                            type="text"
                            placeholder="Strasse, Nr., PLZ oder Ort"
                            register={register}
                            errors={errors}/>
                    </>}
                {type === FILTER_TYPE[3] &&
                    <>
                        <InputWrapper
                            label="Bestellung"
                            id="filter.bestellung"
                            type="text"
                            placeholder="z.B. Familienname"
                            register={register}
                            errors={errors}/>
                        <InputWrapper
                            label="Adresse"
                            id="filter.adresse"
                            type="text"
                            placeholder="Strasse, Nr., PLZ oder Ort"
                            register={register}
                            errors={errors}/>
                    </>}
                <SelectWrapper
                    label="Einsatztyp"
                    id="filter.selectEinsatztyp"
                    options={stringOptions(listEinsatztyp)}
                    register={register}
                    errors={errors}/>
                {type !== FILTER_TYPE[2] &&
                    <SelectWrapper
                        label="Rolle"
                        id="filter.selectRolle"
                        options={stringOptions(listRolle)}
                        register={register}
                        errors={errors}/>}
                {type === FILTER_TYPE[2] &&
                    <SelectWrapper
                        label="Status"
                        id="filter.selectStatus"
                        options={stringOptions(listStatus)}
                        register={register}
                        errors={errors}/>}
                <div className={styles.btnGroup}>
                    <button type="submit" disabled={!isValid}
                            className={`btn ${styles.btn}`}>
                        Filtern
                    </button>
                    <button type="button"
                            className="btn btn-secondary"
                            onClick={onReset}>
                        Zur&uuml;cksetzen
                    </button>
                    <button type="button"
                            className={`btn btn-icon ${styles.btnIconSecondary}`}
                            onClick={doCollapse}>
                        <IconFilterOff/>
                        Ausblenden
                    </button>
                </div>
            </form>
        </div>
    )
}
