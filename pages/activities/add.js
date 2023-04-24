import {useForm} from 'react-hook-form';
import {toast} from "react-toastify";
import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {FaArrowLeft} from "react-icons/fa";
import Link from "next/link";
import {
    applyPropertiesToActivityObject,
    configRequest,
    handleErrorMessage,
    parseCookies,
    parseFormDataToValidProperties
} from "@/helpers/index";
import {API_URL} from "@/config/index";
import {selectCurrentDemand} from "@/store/activitySlice";
import ActivityForm from "@/components/ActitvityForm";

export default function AddActivityPage({token, demands, persistedAvailabilities}) {
    const activityDemand = useSelector(selectCurrentDemand);
    const router = useRouter();
    const rollen = activityDemand.attributes?.gruppe.data.attributes.rollen;

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    const onSubmit = async data => {
        // Form validity
        const parsed = parseFormDataToValidProperties(data.activity);
        const applied = applyPropertiesToActivityObject(parsed, rollen);

        const res = await fetch(`${API_URL}/api/activities`,
            configRequest(
                'POST',
                token,
                JSON.stringify({data: applied})
            )
        );
        if (!res.ok) {
            handleErrorMessage(res, toast);
        } else {
            toast.success('Einsatz erfolgreich gespeichert', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            });
            await router.push('/activities');
        }
    };



    return (
        <Layout title="Einsatz hinzufügen">
            <Link className="link--back" href="/activities"><FaArrowLeft/> Zur&uuml;ck zu Eins&auml;tze</Link>
            <main>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="heading-secondary">Einsatz hinzuf&uuml;gen</h2>

                    <ActivityForm
                        register={register}
                        errors={errors}
                        reset={reset}
                        isValid={isValid}
                        setValue={setValue}
                        demands={demands}
                        persistedAvailabilities={persistedAvailabilities}
                        token={token} />
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
    handleErrorMessage(demandsRes, toast);

    // Fetch availabilities
    const availabilitiesRes = await fetch(`${API_URL}/api/availabilities?populate=rollen&populate=demand&populate=demand.gruppe&populate=benutzer`, configRequest('GET', token));
    const allAvailabilities = await availabilitiesRes.json();
    handleErrorMessage(availabilitiesRes, toast);

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