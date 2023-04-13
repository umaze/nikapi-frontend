import {useForm} from 'react-hook-form';
import {toast} from "react-toastify";
import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {FaArrowRight, FaArrowLeft, FaSave} from "react-icons/fa";
import Link from "next/link";
import Step from "@/components/Step";
import {
    applyPropertiesToActivityObject,
    configRequest,
    formatTime,
    handleErrorMessage,
    parseCookies,
    parseFormDataToValidProperties
} from "@/helpers/index";
import {API_URL} from "@/config/index";
import {
    setDemand,
    setAvailabilities,
    setMatchingOrders,
    initSelectables,
    selectCurrentDemand
} from "@/store/activitySlice";
import ApplyRoles from "@/components/ApplyRoles";
import SelectWrapper from "@/components/SelectWrapper";
import ApplyOrders from "@/components/ApplyOrders";
import Confirmation from "@/components/Confirmation";
import styles from '@/styles/Activities.module.scss';

export default function AddActivityPage({token, demands, persistedAvailabilities}) {
    const [step, setStep] = useState(0);
    const [selectedDatum, setSelectedDatum] = useState('');
    const [selectedEinsatztyp, setSelectedEinsatztyp] = useState('');

    const activityDemand = useSelector(selectCurrentDemand);
    const router = useRouter();
    const rollen = activityDemand.attributes?.gruppe.data.attributes.rollen;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAvailabilities([...persistedAvailabilities]
        ))
    }, []);

    const onSubmit = async data => {
        // Form validity
        const parsed = parseFormDataToValidProperties(data);
        const applied = applyPropertiesToActivityObject(parsed, rollen);

        const res = await fetch(`${API_URL}/api/activities`,
            configRequest(
                'POST',
                token,
                JSON.stringify({data: applied})
            )
        );
        if (!res.ok) {
            handleErrorMessage(res, toast);
        } else {
            toast.success('Einsatz erfolgreich gespeichert', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            });
            await router.push('/activities');
        }

        // console.log(JSON.stringify(applied));
    };

    const handleChange = async event => {
        reset({
            selectDemand: event.target.value
        });
        const selectedDemand = demands.find(demand => +demand.id === +event.target.value);
        setSelectedDatum(selectedDemand.attributes.datum);
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
        const ordersRes = await fetch(`${API_URL}/api/orders?populate=einsatztyp&filters[einsatztyp][typ][$eq]=${demand.attributes.einsatztyp.typ}&filters[datum][$eq]=${demand.attributes.datum}`, configRequest('GET', token));
        const matchingOrders = await ordersRes.json();
        handleErrorMessage(ordersRes);
        return matchingOrders.data;
    }

    const getOptionLabel = demand => {
        const typ = demand.attributes.einsatztyp.typ;
        const datum = new Date(demand.attributes.datum).toLocaleDateString('de-CH')
        const zeit = `${formatTime(demand.attributes.zeitVon)} - ${formatTime(demand.attributes.zeitBis)}`;
        const gruppe = demand.attributes.gruppe.data.attributes.name;
        if (demand.attributes.zeitVon) {
            return `${datum} | ${zeit} | ${typ} [${gruppe}]`;
        } else {
            return `${datum} | keine Zeit | ${typ} [${gruppe}]`;
        }
    };

    const demandOptions = options => (
        <>
            <option value="" hidden>Wähle eine Veranstaltung...</option>
            {options && options.map((option, i) => (
                <option key={i} value={option.id}>{getOptionLabel(option)}</option>
            ))}
        </>
    );

    const DemandFields = () => (
        <Step title="Veranstaltung" info="Eine Veranstaltung auswählen" current={step + 1} size={fieldGroups.length}>
            <div className={styles.infos}>
                <p>Datum: <strong>{selectedDatum ? new Date(selectedDatum).toLocaleDateString('de-CH') : '-'}</strong>
                </p>
                <p>Einsatztyp: <strong>{selectedEinsatztyp || '-'}</strong></p>
            </div>
            <SelectWrapper
                label="Veranstaltung"
                required
                id="selectDemand"
                options={demandOptions(demands)}
                register={(name, required) => register(name, required)}
                handleChange={e => handleChange(e)}
                errors={errors}/>
        </Step>
    );

    const ApplyRolesFields = () => (
        <ApplyRoles
            currentStep={step + 1}
            stepsSize={fieldGroups.length}
            register={register}
            errors={errors}/>
    );

    const ApplyOrdersFields = () => (
        <ApplyOrders
            currentStep={step + 1}
            stepsSize={fieldGroups.length}
            register={register}
            errors={errors}/>
    );

    const ConfirmationFields = () => (
        <Confirmation
            currentStep={step + 1}
            stepsSize={fieldGroups.length}
            register={register}
            errors={errors}/>
    )

    /** Navigation between steps */
    const Navigation = () => (
        <section className={styles.navigationControls}>
            {
                step === fieldGroups.length - 1 &&
                <button type="submit" disabled={!isValid}
                        className="btn btn-icon">
                    <FaSave/>Hinzuf&uuml;gen
                </button>
            }
            {
                step < fieldGroups.length - 1 &&
                <button type="button" onClick={() => setStep(step + 1)} disabled={!isValid}
                        className="btn-secondary btn-icon btn-icon--right">
                    Weiter<FaArrowRight/>
                </button>
            }
            {
                step > 0 &&
                <button type="button" onClick={() => setStep(step - 1)}
                        className="btn-secondary btn-icon">
                    <FaArrowLeft/>Zur&uuml;ck
                </button>
            }
            {
                step === 0 &&
                <Link className="btn-secondary" href={`/activities`}>Abbrechen</Link>
            }
        </section>
    )

    const fieldGroups = [
        <DemandFields/>,
        <ApplyRolesFields/>,
        <ApplyOrdersFields/>,
        <ConfirmationFields/>
    ];

    return (
        <Layout title="Einsatz hinzufügen">
            <Link className="link--back" href="/activities"><FaArrowLeft/> Zur&uuml;ck zu Eins&auml;tze</Link>
            <main>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="heading-secondary">Einsatz hinzuf&uuml;gen</h2>
                    {fieldGroups[step]}
                    <Navigation/>
                </form>
            </main>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const {token} = parseCookies(req);

    // Fetch demands
    const demandsRes = await fetch(`${API_URL}/api/demands?populate=einsatztyp&populate=gruppe.rollen&sort=datum:asc`, configRequest('GET', token));
    const demands = await demandsRes.json();
    handleErrorMessage(demandsRes);

    // Fetch availabilities
    const availabilitiesRes = await fetch(`${API_URL}/api/availabilities?populate=rollen&populate=demand&populate=demand.gruppe&populate=benutzer`, configRequest('GET', token));
    const allAvailabilities = await availabilitiesRes.json();
    handleErrorMessage(availabilitiesRes);

    const persistedAvailabilities = allAvailabilities.data.map((item) => {
        return {
            id: item.id,
            groupId: item.attributes.demand.data.attributes.gruppe.data.id,
            demandId: item.attributes.demand.data.id,
            rollen: item.attributes.rollen,
            benutzer: item.attributes.benutzer?.data.attributes
        }
    });

    return {
        props: {
            demands: demands.data,
            persistedAvailabilities,
            token
        }
    };
}