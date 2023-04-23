import {useForm} from "react-hook-form";
import SelectWrapper from "@/components/SelectWrapper";
import InputWrapper from "@/components/InputWrapper";
import styles from "@/styles/Filter.module.scss";
import {FILTER_TYPE} from "@/config/index";

export default function Filter({type, demandGroups, listEinsatztyp, listRolle, doFilter}) {
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
                benutzer: ""
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
        <div>
            <form className={`form ${styles.filter}`} onSubmit={handleSubmit(onSubmit)}>
                {type === FILTER_TYPE[0] && <SelectWrapper
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
                {type === FILTER_TYPE[1] && <InputWrapper
                    label="Name Mitglied"
                    id="filter.benutzer"
                    type="text"
                    placeholder=""
                    register={register}
                    errors={errors}/>}
                <SelectWrapper
                    label="Einsatztyp"
                    id="filter.selectEinsatztyp"
                    options={stringOptions(listEinsatztyp)}
                    register={register}
                    errors={errors}/>
                <SelectWrapper
                    label="Rolle"
                    id="filter.selectRolle"
                    options={stringOptions(listRolle)}
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
