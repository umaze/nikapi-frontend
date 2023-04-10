import Layout from "@/components/Layout";
import AvailabilityItem from "@/components/AvailabilityItem";
import { API_URL, PER_PAGE } from "@/config/index";
import Pagination from '@/components/Pagination';
import {configRequest, parseCookies} from "@/helpers/index";
import Link from "next/link";

export default function MyAvailabilitiesPage({ availabilities, page, total }) {
    return (
        <Layout>
            <h1 className="heading-primary">Meine Verf&uuml;gbarkeiten</h1>
            <Link className="btn" href={`/availabilities/me/manage`}>
                Verf&uuml;gbarkeiten&nbsp;{availabilities.length === 0 ? 'hinzufügen' : 'verwalten'}
            </Link>

            {availabilities.length === 0 && <p className="info-no-data">Es sind keine Verf&uuml;gbarkeiten vorhanden.</p>}
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
    const availabilitiesRes = await fetch(`${API_URL}/api/availabilities/me?populate=rollen&populate=demand.einsatztyp&populate=benutzer&sort=bemerkung:asc&pagination[limit]=${PER_PAGE}&pagination[start]=${start}`, configRequest('GET', token));
    const availabilities = await availabilitiesRes.json();

    return {
        props: {
            availabilities: availabilities.data,
            page: +page,
            total: availabilities.meta.pagination?.total || 0
        }
    };
}
