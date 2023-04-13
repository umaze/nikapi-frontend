import {
    applyPropertiesToOrderObject,
    configRequest,
    parseCookies,
    parseFormDataToValidProperties
} from "@/helpers/index";
import {API_URL} from "@/config/index";
import Link from "next/link";
import {FaArrowLeft, FaSave} from "react-icons/fa";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import Layout from "@/components/Layout";
import OrderForm from "@/components/OrderForm";
import styles from "@/styles/OrderAdd.module.scss";

export default function EditOrderPage({order, token}) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const onSubmit = async data => {
        const parsed = parseFormDataToValidProperties(data.order);
        const applied = applyPropertiesToOrderObject(parsed);
        console.log(`${JSON.stringify(applied)}`);
    };

    return (
        <Layout title="Bestellung ändern">
            <Link className="link--back" href="/orders"><FaArrowLeft/> Zur&uuml;ck zu Bestellungen</Link>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="heading-secondary">Bestellung &auml;ndern</h2>

                    <OrderForm register={register} errors={errors} order={order} setValue={setValue} />

                    <button type="submit" disabled={!isValid}
                            className={`btn btn-icon ${styles.btn}`}>
                        <FaSave/>&Auml;nderung speichern
                    </button>
                </form>
        </Layout>);
}

export async function getServerSideProps({ params: { id }, req }) {
    const { token } = parseCookies(req);

    const res = await fetch(`${API_URL}/api/orders/${id}?populate=*`, configRequest('GET', token));
    const order = await res.json();

    return {
        props: {
            order: {
                id: order.data.id,
                ...order.data.attributes
            },
            token
        }
    };
}