import styles from '@/styles/Activities.module.scss'
import {useForm} from 'react-hook-form'
import Layout from "@/components/Layout";
import {useState} from "react";
import {FaArrowRight, FaArrowLeft, FaSave} from "react-icons/fa";
import Link from "next/link";
import Step from "@/components/Step";

export default function AddActivityPage() {
    const {
        register,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const onSubmit = data => console.log(data);

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

    /** Select field component */
    const Select = ({label, required, id}) => (
        <div>
            <legend>{label}</legend>
            <select
                {...register(label, {required})}
                className={errors[label] && styles.inputInvalid}
                id={id}
                autoComplete="off">
                <option>Demand 1</option>
                <option>Demand 2</option>
                <option>Demand 3</option>
            </select>
            {errors[label] && <span>mandatory</span>}
        </div>
    )

    /** Group the person input fields in a component */
    const DemandFields = () => (
        <Step title="Veranstaltung wählen" current={step + 1} size={fieldGroups.length}>
            <Select label="Bitte wähle eine Veranstaltung:" required id="selectDemand"/>
        </Step>
    )

    /** Group the contact input fields in a component */
    const ContactFields = () => (
        <Step title="Tour erstellen" current={step + 1} size={fieldGroups.length}>
            <Input label="Email" required type="email" placeholder="exemple@exemple.com"/>
            <Input label="Phone" required type="tel" placeholder="(00) 0.0000-0000"/>
        </Step>
    )

    /** Group the address input fields in a component */
    const AddressFields = () => (
        <Step title="Status setzen" current={step + 1} size={fieldGroups.length}>
            <Input label="Street" required type="text" placeholder="Street name, avenue, etc..."/>
            <Input label="Number" required type="number" placeholder="000"/>
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
        <ContactFields/>,
        <AddressFields/>
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