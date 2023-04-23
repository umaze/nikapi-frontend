import {useForm} from "react-hook-form";
import SelectWrapper from "@/components/SelectWrapper";
import InputWrapper from "@/components/InputWrapper";
import styles from "@/styles/Filter.module.scss";

export default function Filter({demandGroups, listEinsatztyp, doFilter}) {
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
                selectEinsatztyp: ""
            }
        });
        doFilter({});
    };

    const demandGroupOptions = options => (
        <>
            <option value="">Keine Gruppe</option>
            {options && options.map((option, i) => (
                <option key={i} value={option.id}>{option.attributes.name}</option>
            ))}
        </>
    );

    const stringOptions = (options, emptyLabel = 'leer') => (
        <>
            <option value="">{emptyLabel}</option>
            {options && options.map((option, i) => (
                <option key={i} value={option}>{option}</option>
            ))}
        </>
    );

    const rollen = demandGroups?.length > 0 ?
        [...new Set(demandGroups.flatMap(group => group.attributes.rollen?.map(rolle => rolle.name)))] :
        [];

    return (
        <div>
            <form className={`form ${styles.filter}`} onSubmit={handleSubmit(onSubmit)}>
                <SelectWrapper
                    label="Gruppe"
                    id="filter.selectDemandGroup"
                    options={demandGroupOptions(demandGroups)}
                    register={register}
                    errors={errors}/>
                <InputWrapper
                    label="Datum"
                    id="filter.datum"
                    type="date"
                    placeholder=""
                    register={register}
                    errors={errors}/>
                <SelectWrapper
                    label="Einsatztyp"
                    id="filter.selectEinsatztyp"
                    options={stringOptions(listEinsatztyp, 'Kein Einsatztyp')}
                    register={register}
                    errors={errors}/>
                <SelectWrapper
                    label="Rolle"
                    id="filter.selectRolle"
                    options={stringOptions(rollen, 'Keine Rolle')}
                    register={register}
                    errors={errors}/>
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
                </div>
            </form>
        </div>
    )
}
