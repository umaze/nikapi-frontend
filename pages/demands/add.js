import Link from "next/link";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {FaArrowLeft, FaSave} from "react-icons/fa";
import {toast} from "react-toastify";
import {API_URL} from "@/config/index";
import Layout from "@/components/Layout";
import {
    applyPropertiesToDemandObject,
    configRequest,
    handleErrorMessage,
    parseCookies,
    parseFormDataToValidProperties
} from "@/helpers/index";
import styles from "@/styles/OrderAdd.module.scss";
import DemandForm from "@/components/DemandForm";

export default function AddDemandPage({demandGroups, token}) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const onSubmit = async data => {
        // Form validity
        const parsed = parseFormDataToValidProperties(data.demand);
        const applied = applyPropertiesToDemandObject(parsed);

        const res = await fetch(`${API_URL}/api/demands`,
            configRequest(
                'POST',
                token,
                JSON.stringify({data: applied})
            )
        );

        if (!res.ok) {
            handleErrorMessage(res, toast);
        } else {
            toast.success('Veranstaltung erfolgreich gespeichert', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            });
            await router.push('/demands');
        }
    };

    return (
        <Layout title="Veranstaltung hinzufügen">
            <Link className="link--back" href="/demands"><FaArrowLeft/> Zur&uuml;ck zu Veranstaltungen</Link>
            <main>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="heading-secondary">Veranstaltung hinzuf&uuml;gen</h2>

                    <DemandForm register={register} errors={errors} demandGroups={demandGroups} />

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

    // Fetch demands
    const demandGroupsRes = await fetch(`${API_URL}/api/demand-groups`, configRequest('GET', token));
    const demandGroups = await demandGroupsRes.json();
    handleErrorMessage(demandGroupsRes);

    return {
        props: {
            demandGroups: demandGroups.data,
            token
        }
    };
}
