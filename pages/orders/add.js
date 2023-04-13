import Link from "next/link";
import {useForm} from "react-hook-form";
import {FaArrowLeft, FaSave} from "react-icons/fa";
import {toast} from "react-toastify";
import {API_URL, EINSATZTYP_ORDER, STATUS_ORDER} from "@/config/index";
import Layout from "@/components/Layout";
import {
    configRequest,
    handleErrorMessage,
    parseCookies,
    getOptions,
    parseFormDataToValidProperties, applyPropertiesToOrderObject
} from "@/helpers/index";
import {useRouter} from "next/router";
import InputWrapper from "@/components/InputWrapper";
import SelectWrapper from "@/components/SelectWrapper";
import styles from "@/styles/OrderAdd.module.scss";

export default function AddOrderPage({token}) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const onSubmit = async data => {
        // Form validity
        const parsed = parseFormDataToValidProperties(data);
        const applied = applyPropertiesToOrderObject(parsed);

        console.log(`${JSON.stringify(applied)}`);

        const res = await fetch(`${API_URL}/api/orders`,
            configRequest(
                'POST',
                token,
                JSON.stringify({data: applied})
            )
        );

        if (!res.ok) {
            handleErrorMessage(res, toast);
        } else {
            toast.success('Bestellung erfolgreich gespeichert', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            });
            await router.push('/orders');
        }
    };

    return (
        <Layout title="Bestellung hinzufügen">
            <Link className="link--back" href="/orders"><FaArrowLeft/> Zur&uuml;ck zu Bestellungen</Link>
            <main>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="heading-secondary">Bestellung hinzuf&uuml;gen</h2>
                    <div className={`container grid grid--3-cols ${styles.order}`}>
                        <InputWrapper
                            label="Bezeichnung"
                            id="bezeichnung"
                            type="text"
                            required
                            placeholder="Kennzeichnung des Einsatzes"
                            register={register}
                            errors={errors} />
                        <div className={styles.gridSpan2}>
                            <InputWrapper
                                label="Adresse"
                                id="adresse"
                                type="text"
                                required
                                placeholder="Strasse, Hausnummer, PLZ und Ort"
                                register={register}
                                errors={errors} />
                        </div>
                        <InputWrapper
                            label="Auftraggeber"
                            id="auftraggeber"
                            type="text"
                            required
                            placeholder="Vorname Name"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Kontakt"
                            id="kontakt"
                            type="text"
                            required
                            placeholder="Vorname Name"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Anzahl Kinder"
                            id="anzahl"
                            type="number"
                            required
                            placeholder="-"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Gewünschtes Datum"
                            id="datum"
                            type="date"
                            required
                            placeholder=""
                            register={register}
                            errors={errors} />
                        <SelectWrapper
                            label="Status"
                            required
                            id="selectStatus"
                            options={getOptions(STATUS_ORDER)}
                            register={register}
                            errors={errors}/>
                        <SelectWrapper
                            label="Einsatztyp"
                            required
                            id="selectEinsatztyp"
                            options={getOptions(EINSATZTYP_ORDER)}
                            register={register}
                            errors={errors}/>
                        <div className={styles.gridSpan3}>
                            <InputWrapper
                                label="Bemerkungen"
                                id="bemerkung"
                                type="text"
                                placeholder="Was ist zu beachten?"
                                register={register}
                                errors={errors} />
                        </div>
                    </div>

                    <button type="submit" disabled={!isValid}
                            className={`btn btn-icon ${styles.btn}`}>
                        <FaSave/>Hinzuf&uuml;gen
                    </button>
                </form>
            </main>
        </Layout>
    );
}

export async function getServerSideProps({req}) {
    const {token} = parseCookies(req);

    return {
        props: {
            token
        }
    };
}
