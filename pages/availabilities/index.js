import Layout from "@/components/Layout";
import AvailabilityItem from "@/components/AvailabilityItem";
import { API_URL, PER_PAGE } from "@/config/index";
import Pagination from '@/components/Pagination';
import {configRequest, parseCookies} from "@/helpers/index";

export default function AvailabilitiesPage({ availabilities, page, total }) {
    return (
        <Layout>
            <h1>Verf&uuml;gbarkeiten</h1>
            {availabilities.length === 0 && <h3>No availabilities to show</h3>}
            {availabilities.map(availability => (
                <AvailabilityItem key={availability.id} availability={availability.attributes} />
            ))}

            <Pagination page={page} total={total} />
        </Layout >
    )
}

export async function getServerSideProps({ req, query: { page = 1 } }) {
    const {token} = parseCookies(req);
    // Calculate start page
    const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

    // Fetch availabilities
    const availabilitiesRes = await fetch(`${API_URL}/api/availabilities?populate=rollen&populate=demand.einsatztyp&sort=bemerkung:asc&pagination[limit]=${PER_PAGE}&pagination[start]=${start}`, configRequest('GET', token));
    const availabilities = await availabilitiesRes.json();
    console.log(`${JSON.stringify(availabilities.data)}`);

    return {
        props: {
            availabilities: availabilities.data,
            page: +page,
            total: availabilities.meta.pagination.total
        }
    };
}
