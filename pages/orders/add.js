import Link from "next/link";
import {useForm} from "react-hook-form";
import {FaArrowLeft, FaSave} from "react-icons/fa";
import {toast} from "react-toastify";
import {API_URL} from "@/config/index";
import Layout from "@/components/Layout";
import {configRequest, handleErrorMessage, parseCookies} from "@/helpers/index";
import {useRouter} from "next/router";
import InputWrapper from "@/components/InputWrapper";
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


        const res = await fetch(`${API_URL}/api/orders`,
            configRequest(
                'POST',
                token,
                JSON.stringify({data: data})
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
                            type="text"
                            required
                            placeholder="Kennzeichnung des Einsatzes"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Adresse"
                            type="text"
                            required
                            placeholder="Strasse, Hausnummer, PLZ und Ort"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Auftraggeber"
                            type="text"
                            required
                            placeholder="Vorname Name"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Kontakt"
                            type="text"
                            required
                            placeholder="Vorname Name"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Anzahl Kinder"
                            type="number"
                            required
                            placeholder="-"
                            register={register}
                            errors={errors} />
                    </div>

                    <button type="submit" disabled={!isValid}
                            className="btn btn-icon">
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
