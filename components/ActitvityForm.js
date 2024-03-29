import {
    addSelectable,
    initSelectables, initSteps, selectCurrentDemand,
    setAvailabilities,
    setDemand,
    setMatchingOrders,
    setRole, updateSteps
} from "@/store/activitySlice";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {API_URL} from "@/config/index";
import {configRequest, formatDate, formatTime, handleErrorMessage} from "@/helpers/index";
import {toast} from "react-toastify";
import Step from "@/components/Step";
import SelectWrapper from "@/components/SelectWrapper";
import ApplyRoles from "@/components/ApplyRoles";
import ApplyOrders from "@/components/ApplyOrders";
import Confirmation from "@/components/Confirmation";
import {FaSave} from "react-icons/fa";
import {IconArrowLeft, IconArrowRight} from "@tabler/icons-react";
import styles from "@/styles/Activities.module.scss";

export default function ActivityForm({
                                         activity,
                                         demands,
                                         persistedAvailabilities,
                                         token,
                                         register,
                                         errors,
                                         reset,
                                         isValid,
                                         setValue,
                                         readOnly
                                     }) {
    const [step, setStep] = useState(0);
    const [selectedDatum, setSelectedDatum] = useState('');
    const [selectedEinsatztyp, setSelectedEinsatztyp] = useState('');
    const [selectedZeitVon, setSelectedZeitVon] = useState('');
    const [selectedZeitBis, setSelectedZeitBis] = useState('');
    const [selectedGruppe, setSelectedGruppe] = useState('');
    const activityDemand = useSelector(selectCurrentDemand);

    const dispatch = useDispatch();

    useEffect(() => {
        let stepsChecked = {};
        stepsChecked['4'] = isValid
        dispatch(updateSteps(stepsChecked));
    }, [isValid]);

    useEffect(() => {
        let stepsChecked = {};
        stepsChecked['1'] = !!activityDemand?.id
        dispatch(updateSteps(stepsChecked));
    }, [activityDemand]);

    useEffect(() => {
        dispatch(initSteps);
        if (activity) {
            const demand = activity.demand.data;
            if (demand) {
                initialize(demand);
            }
            const selectsRollen = initRoles(activity.rollen);
            setValue('activity', {
                bezeichnung: activity.bezeichnung,
                bemerkung: activity.bemerkung,
                selectStatus: activity.status,
                selectDemand: demand?.id,
                orders: activity.orders,
                ...selectsRollen
            });
        }
        dispatch(setAvailabilities([...persistedAvailabilities]
        ));
    }, []);

    const handleChange = async event => {
        reset({
            activity: {
                selectDemand: event.target.value
            }
        });
        const selectedDemand = demands.find(demand => +demand.id === +event.target.value);
        await initialize(selectedDemand);
    };

    const initRoles = rollen => {
        const props = {};
        rollen.forEach((item, i) => {
            const state = {};
            const prop = `${item.rolle.name.toLowerCase()}_${i}`;
            const value = `${item.availability.data.id}`;
            state[prop] = value;
            props[`select${prop}`] = value;
            dispatch(setRole(state));
            dispatch(addSelectable(state));
        });
        return props;
    };

    const initialize = async selectedDemand => {
        setSelectedDatum(selectedDemand.attributes.datum);
        setSelectedZeitVon(selectedDemand.attributes.zeitVon);
        setSelectedZeitBis(selectedDemand.attributes.zeitBis);
        setSelectedGruppe(selectedDemand.attributes.gruppe?.data?.attributes.name);
        setSelectedEinsatztyp(selectedDemand.attributes.einsatztyp.typ);
        dispatch(
            setDemand({
                ...selectedDemand
            })
        );
        dispatch(initSelectables());
        const matchingOrders = await fetchMatchingOrders(selectedDemand);
        const orders = matchingOrders.length > 0 ? [...matchingOrders] : [];
        dispatch(
            setMatchingOrders(
                orders
            )
        );
    };

    const fetchMatchingOrders = async demand => {
        // Fetch relevant orders (matching einsatztyp and datum)
        const ordersRes = await fetch(`${API_URL}/api/orders?populate=einsatztyp&populate=activity&filters[einsatztyp][typ][$eq]=${demand.attributes.einsatztyp.typ}&filters[datum][$eq]=${demand.attributes.datum}`, configRequest('GET', token));
        const matchingOrders = await ordersRes.json();
        handleErrorMessage(ordersRes, toast);
        return matchingOrders.data;
    }

    const getOptionLabel = demand => {
        const typ = demand.attributes.einsatztyp?.typ;
        const datum = formatDate(demand.attributes.datum);
        const zeit = `${formatTime(demand.attributes.zeitVon)} - ${formatTime(demand.attributes.zeitBis)}`;
        return `${datum} - ${typ}${demand.attributes.zeitVon ? ` (${zeit})` : ''}`;
    };

    const demandOptions = options => (
        <>
            <option value="" hidden>Wähle eine Veranstaltung...</option>
            {options && options.map((option, i) => (
                <option key={i} value={option.id}>{getOptionLabel(option)}</option>
            ))}
        </>
    );

    const isSelectDisabled = readOnly || (!!activity && !!activity.demand.data);

    const DemandFields = () => (
        <Step title="Veranstaltung" info="Eine Veranstaltung auswählen" current={step + 1} size={fieldGroups.length} showHint={!isSelectDisabled}>
            <div className={styles.infos}>
                <p><strong>Datum</strong>: {selectedDatum ? formatDate(selectedDatum) : '-'}</p>
                <p><strong>Einsatztyp:</strong> {selectedEinsatztyp || '-'}</p>
            </div>
            <SelectWrapper
                label="Veranstaltung"
                required
                disabled={isSelectDisabled}
                id="activity.selectDemand"
                options={demandOptions(demands)}
                register={register}
                handleChange={e => handleChange(e)}
                errors={errors}/>
            <div className={`grid grid--2-cols ${styles.range}`}>
                <div className={styles.wrapper}>
                    <label htmlFor="demand.zeitVon">Zeit von</label>
                    <div className={styles.inputField}>
                        <input
                            id="demand.zeitVon"
                            type="time"
                            value={selectedZeitVon}
                            disabled={true}/>
                    </div>
                </div>
                <div className={styles.wrapper}>
                    <label htmlFor="demand.zeitBis">Zeit bis</label>
                    <div className={styles.inputField}>
                        <input
                            id="demand.zeitBis"
                            type="time"
                            value={selectedZeitBis}
                            disabled={true}/>
                    </div>
                </div>
            </div>
            <div className={styles.wrapper}>
                <label htmlFor="demandGroup">Gruppe</label>
                <div className={styles.inputField}>
                    <input
                        id="demandGroup"
                        type="text"
                        value={selectedGruppe}
                        disabled={true}/>
                </div>
            </div>
        </Step>
    );

    const ApplyRolesFields = () => (
        <ApplyRoles
            currentStep={step + 1}
            stepsSize={fieldGroups.length}
            register={register}
            errors={errors}
            readOnly={readOnly}/>
    );

    const ApplyOrdersFields = () => (
        <ApplyOrders
            currentStep={step + 1}
            stepsSize={fieldGroups.length}
            setValue={setValue}
            orders={activity?.orders.data}
            readOnly={readOnly}/>
    );

    const ConfirmationFields = () => (
        <Confirmation
            currentStep={step + 1}
            stepsSize={fieldGroups.length}
            register={register}
            errors={errors}
            readOnly={readOnly}/>
    )

    /** Navigation between steps */
    const Navigation = () => (
        <section className={styles.navigationControls}>
            {
                step === fieldGroups.length - 1 &&
                <div className={styles.btnGroup}>
                    <button type="button" onClick={() => setStep(step - 1)}
                            className="btn-secondary btn-icon">
                        <IconArrowLeft/>Zur&uuml;ck
                    </button>
                    <button type="submit" disabled={!isValid}
                            className="btn btn-icon">
                        {readOnly ? 'OK' : <FaSave/>}{!readOnly ? 'Speichern' : ''}
                    </button>
                </div>
            }
            {
                step < fieldGroups.length - 1 &&
                <div className={styles.btnGroup}>
                    <button type="button" onClick={() => setStep(step - 1)} disabled={step === 0}
                            className="btn-secondary btn-icon">
                        <IconArrowLeft/>Zur&uuml;ck
                    </button>
                    <button type="button" onClick={() => setStep(step + 1)} disabled={!isValid}
                            className="btn-secondary btn-icon btn-icon--right">
                        Weiter<IconArrowRight/>
                    </button>
                </div>
            }
            <Link className="btn-secondary" href={`/activities`}>Abbrechen</Link>
        </section>
    )

    const fieldGroups = [
        <DemandFields/>,
        <ApplyRolesFields/>,
        <ApplyOrdersFields/>,
        <ConfirmationFields/>
    ];

    return (
        <>
            {fieldGroups[step]}
            <Navigation/>
        </>
    );
}
