import styles from '@/styles/Activities.module.scss'
import {useForm} from 'react-hook-form'
import Layout from "@/components/Layout";
import {useState} from "react";
import {FaArrowRight, FaArrowLeft, FaSave} from "react-icons/fa";
import Link from "next/link";

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

    /** Group the person input fields in a component */
    const PersonFields = () => (
        <section className={styles.inputGroup}>
            <h3 className="heading-tertiary">Veranstaltung wählen</h3>
            <Input label="Full name" required type="text" placeholder="Ex: Maria Leopoldina de Habsburgo"/>
            <Input label="Birthday" required type="date" placeholder="dd/mm/aaa"/>
        </section>
    )

    /** Group the contact input fields in a component */
    const ContactFields = () => (
        <section className={styles.inputGroup}>
            <h3 className="heading-tertiary">Tour erstellen</h3>
            <Input label="Email" required type="email" placeholder="exemple@exemple.com"/>
            <Input label="Phone" required type="tel" placeholder="(00) 0.0000-0000"/>
        </section>
    )

    /** Group the address input fields in a component */
    const AddressFields = () => (
        <section className={styles.inputGroup}>
            <h3 className="heading-tertiary">Status setzen</h3>
            <Input label="Street" required type="text" placeholder="Street name, avenue, etc..."/>
            <Input label="Number" required type="number" placeholder="000"/>
        </section>
    )

    /** Navigation between steps */
    const Navigation = () => (
        <section className={styles.navigationControls}>
            {
                step === fieldGroups.length - 1 &&
                <button type="submit" disabled={!isValid}
                        className="btn btn-icon">
                    <FaSave/> Hinzufügen
                </button>
            }
            {
                step < fieldGroups.length - 1 &&
                <button type="button" onClick={() => setStep(step + 1)} disabled={!isValid}
                        className="btn-secondary btn-icon">
                    <FaArrowRight/> Next
                </button>
            }
            {
                step > 0 &&
                <button type="button" onClick={() => setStep(step - 1)}
                        className="btn-secondary btn-icon">
                    <FaArrowLeft/> Back
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
        <PersonFields/>,
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