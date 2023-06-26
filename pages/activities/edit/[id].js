import {
    applyPropertiesToActivityObject,
    configRequest,
    handleErrorMessage,
    parseCookies,
    parseFormDataToValidProperties
} from "@/helpers/index";
import {API_URL} from "@/config/index";
import Link from "next/link";
import {IconArrowLeft} from "@tabler/icons-react";
import {useForm} from "react-hook-form";
import Layout from "@/components/Layout";
import {toast} from "react-toastify";
import ActivityForm from "@/components/ActitvityForm";
import {useSelector} from "react-redux";
import {selectCurrentDemand} from "@/store/activitySlice";
import {useRouter} from "next/router";

export default function EditActivityPage({activity, demands, persistedAvailabilities, token}) {
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
        const parsed = parseFormDataToValidProperties(data.activity);
        const applied = applyPropertiesToActivityObject(parsed, rollen);

        const res = await fetch(`${API_URL}/api/activities/${activity.id}`,
            configRequest(
                'PUT',
                token,
                JSON.stringify({data: applied})
            )
        );
        if (!res.ok) {
            handleErrorMessage(res, toast);
        } else {
            toast.success('Änderung Einsatz erfolgreich gespeichert', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            });
            await router.push('/activities');
        }
    };

    return (
        <Layout title="Einsatz hinzufügen">
            <Link className="link--back" href="/activities"><IconArrowLeft/> Zur&uuml;ck zu Eins&auml;tze</Link>
            <main>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="heading-secondary">Einsatz bearbeiten</h1>

                    <ActivityForm
                        register={register}
                        errors={errors}
                        reset={reset}
                        isValid={isValid}
                        setValue={setValue}
                        activity={activity}
                        demands={demands}
                        persistedAvailabilities={persistedAvailabilities}
                        token={token}/>
                </form>
            </main>
        </Layout>
    );
}

export async function getServerSideProps({params: {id}, req}) {
    const {token} = parseCookies(req);

    // Fetch activity
    const res = await fetch(`${API_URL}/api/activities/${id}?populate=demand&populate=rollen.rolle&populate=rollen.availability&populate=orders&populate=demand.einsatztyp&populate=demand.gruppe.rollen&populate=availabilities`, configRequest('GET', token));
    const activity = await res.json();
    let demands = [];

    if (activity.data.attributes.demand.data) {
        demands = [activity.data.attributes.demand.data];
    } else {
        // Fetch demands
        const demandsRes = await fetch(`${API_URL}/api/demands?populate=einsatztyp&populate=gruppe.rollen&sort=datum:asc`, configRequest('GET', token));
        const list = await demandsRes.json();
        if (!demandsRes.ok) {
            handleErrorMessage(demandsRes, toast);
        } else {
            demands = list.data;
        }
    }

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
            activity: {
                id: activity.data.id,
                ...activity.data.attributes
            },
            demands,
            persistedAvailabilities,
            token
        }
    };
}