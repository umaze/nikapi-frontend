import {
    applyPropertiesToOrderObject,
    configRequest, handleErrorMessage,
    parseCookies,
    parseFormDataToValidProperties
} from "@/helpers/index";
import {API_URL} from "@/config/index";
import Link from "next/link";
import {FaSave} from "react-icons/fa";
import {IconArrowLeft} from "@tabler/icons-react";
import {useForm} from "react-hook-form";
import Layout from "@/components/Layout";
import OrderForm from "@/components/OrderForm";
import {toast} from "react-toastify";
import styles from "@/styles/OrderAdd.module.scss";

export default function EditOrderPage({order, token}) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const onSubmit = async data => {
        const parsed = parseFormDataToValidProperties(data.order);
        const applied = applyPropertiesToOrderObject(parsed);

        const res = await fetch(`${API_URL}/api/orders/${order.id}`,
            configRequest(
                'PUT',
                token,
                JSON.stringify({data: applied})
            )
        );

        if (!res.ok) {
            handleErrorMessage(res, toast);
        } else {
            toast.success('Bestellung erfolgreich geändert', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            });
            // No routing because of more changes.
            // await router.push('/orders');
        }
    };

    return (
        <Layout title="Bestellung ändern">
            <Link className="link--back" href="/orders"><IconArrowLeft/> Zur&uuml;ck zu Bestellungen</Link>
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