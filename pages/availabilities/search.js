import qs from 'qs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from "@/components/Layout";
import AvailabilityItem from "@/components/AvailabilityItem";
import { API_URL } from "@/config/index";

export default function SearchPage({ availabilities }) {
    const router = useRouter();

    return (
        <Layout title="Search Results">
            <Link href="/availabilities">Zur&uuml;ck zu Verf&uuml;gbarkeiten</Link>
            <h1>Search Results for {router.query.term}</h1>
            {availabilities.length === 0 && <h3>No availabilities to show</h3>}
            {availabilities.map(availability => (
                <AvailabilityItem key={availability.id} availability={availability.attributes} />
            ))}
        </Layout>
    )
}

export async function getServerSideProps({ query: { term } }) {
    const query = qs.stringify({
        filters: {
            $or: [
                { name: { $contains: term } },
                { performers: { $contains: term } },
                { description: { $contains: term } },
                { venue: { $contains: term } }
            ]
        }
    });

    const res = await fetch(`${API_URL}/api/availabilities?${query}&populate=*`);
    const availabilities = await res.json();

    return {
        props: { availabilities: availabilities.data }
    };
}
