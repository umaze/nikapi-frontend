import styles from '@/styles/Activities.module.scss'
import {useForm} from 'react-hook-form'
import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {FaArrowRight, FaArrowLeft, FaSave} from "react-icons/fa";
import Link from "next/link";
import Step from "@/components/Step";
import {configRequest, formatTime, handleErrorMessage, parseCookies} from "@/helpers/index";
import {API_URL} from "@/config/index";
import {useDispatch} from "react-redux";
import {setDemand, setAvailabilities, setMatchingOrders} from "@/store/activitySlice";
import ApplyRoles from "@/components/ApplyRoles";
import Select from "@/components/Select";
import ApplyOrders from "@/components/ApplyOrders";

export default function AddActivityPage({token, demands, persistedAvailabilities}) {
    const {
        register,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAvailabilities([...persistedAvailabilities]
        ))
    }, []);

    const onSubmit = data => console.log(data);
    const handleChange = async event => {
        const selectedDemand = demands.find(demand => +demand.id === +event.target.value);
        dispatch(
            setDemand({
                ...selectedDemand
            })
        );
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

    /** Input field component */
    const Input = ({label, required, type, placeholder}) => (
        <div>
            <legend>{label}</legend>
            <input
                {...register(label, {required})}
                className={errors[label] && styles.inputInvalid}
                type={type}
                placeholder={placeholder}
            />
            {errors[label] && <span>mandatory</span>}
        </div>
    )

    const demandOptions = options => (
        <>
            <option value={0} hidden>Wähle eine Veranstaltung...</option>
            {options && options.map((option, i) => (
                <option key={i} value={option.id}>{getOptionLabel(option)}</option>
            ))}
        </>
    );

    const DemandFields = () => (
        <Step title="Veranstaltung wählen" current={step + 1} size={fieldGroups.length}>
            <Select
                label="Veranstaltung"
                required
                id="selectDemand"
                options={demandOptions(demands)}
                register={(name, required) => register(name, {required: required})}
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
        <Step title="Status setzen" current={step + 1} size={fieldGroups.length}>
            <Input label="Bemerkungen" required type="text" placeholder="Spezielles zu beachten, Besonderheiten, ..."/>
            <Input label="Zeit" required type="time"/>
        </Step>
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

    /** Mark the input group already filled as blue or gray if not */
    const Reference = () => (
        <footer className={styles.reference}>
            {renderMarkers()}
        </footer>
    )

    function renderMarkers() {
        let markers = [];
        fieldGroups.forEach((_, i) => {
            markers.push(<span key={i} className={step >= i ? styles.markerBlue : styles.markerGray}/>);
        });
        return markers;
    }

    const [step, setStep] = useState(0);
    const fieldGroups = [
        <DemandFields/>,
        <ApplyRolesFields/>,
        <ApplyOrdersFields/>,
        <ConfirmationFields/>
    ];

    return (
        <Layout title="Einsatz hinzufügen">
            <Link className="link--back" href="/activities">Zur&uuml;ck zu Eins&auml;tze</Link>
            <main>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="heading-secondary">Einsatz hinzuf&uuml;gen</h2>
                    {fieldGroups[step]}
                    <Navigation/>
                    <Reference/>
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