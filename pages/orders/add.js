import Link from "next/link";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {FaArrowLeft, FaSave} from "react-icons/fa";
import {toast} from "react-toastify";
import {API_URL} from "@/config/index";
import Layout from "@/components/Layout";
import OrderForm from "@/components/OrderForm";
import {
    configRequest,
    handleErrorMessage,
    parseCookies,
    parseFormDataToValidProperties, applyPropertiesToOrderObject
} from "@/helpers/index";
import styles from "@/styles/OrderAdd.module.scss";

export default function AddOrderPage({token}) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const onSubmit = async data => {
        // Form validity
        const parsed = parseFormDataToValidProperties(data.order);
        const applied = applyPropertiesToOrderObject(parsed);

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

                    <OrderForm register={register} errors={errors} />

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
