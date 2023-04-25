import {
    applyPropertiesToDemandObject,
    configRequest,
    handleErrorMessage,
    parseCookies,
    parseFormDataToValidProperties
} from "@/helpers/index";
import {API_URL} from "@/config/index";
import Link from "next/link";
import {FaSave} from "react-icons/fa";
import {IconArrowLeft} from "@tabler/icons-react";
import {useForm} from "react-hook-form";
import Layout from "@/components/Layout";
import {toast} from "react-toastify";
import styles from "@/styles/OrderAdd.module.scss";
import DemandForm from "@/components/DemandForm";

export default function EditDemandPage({demand, demandGroups, token}) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const onSubmit = async data => {
        const parsed = parseFormDataToValidProperties(data.demand);
        const applied = applyPropertiesToDemandObject(parsed);

        const res = await fetch(`${API_URL}/api/demands/${demand.id}`,
            configRequest(
                'PUT',
                token,
                JSON.stringify({data: applied})
            )
        );

        if (!res.ok) {
            handleErrorMessage(res, toast);
        } else {
            toast.success('Veranstaltung erfolgreich geändert', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            });
            // No routing because of more changes.
            // await router.push('/demands');
        }
    };

    return (
        <Layout title="Veranstaltung ändern">
            <Link className="link--back" href="/demands"><IconArrowLeft/> Zur&uuml;ck zu Veranstaltungen</Link>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="heading-secondary">Veranstaltung &auml;ndern</h2>

                    <DemandForm register={register} errors={errors} demand={demand} demandGroups={demandGroups} setValue={setValue} />

                    <button type="submit" disabled={!isValid}
                            className={`btn btn-icon ${styles.btn}`}>
                        <FaSave/>&Auml;nderung speichern
                    </button>
                </form>
        </Layout>);
}

export async function getServerSideProps({ params: { id }, req }) {
    const { token } = parseCookies(req);

    // Fetch demand
    const res = await fetch(`${API_URL}/api/demands/${id}?populate=*`, configRequest('GET', token));
    const demand = await res.json();

    // Fetch demand groups
    const demandGroupsRes = await fetch(`${API_URL}/api/demand-groups?populate=rollen`, configRequest('GET', token));
    const demandGroups = await demandGroupsRes.json();
    handleErrorMessage(demandGroupsRes, toast);

    return {
        props: {
            demand: {
                id: demand.data.id,
                ...demand.data.attributes
            },
            demandGroups: demandGroups.data,
            token
        }
    };
}