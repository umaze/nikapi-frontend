import Link from 'next/link';
import Layout from "@/components/Layout";
import AvailabilityItem from "@/components/AvailabilityItem";
import { API_URL } from "@/config/index";

export default function HomePage({ availabilities }) {
  return (
    <Layout>
      <h1>Upcoming Availabilities</h1>
      {availabilities.length === 0 && <h3>No availabilities to show</h3>}
      {availabilities.map(availability => (
        <AvailabilityItem key={availability.id} availability={availability.attributes} />
      ))}

      {availabilities.length > 0 && (
        <Link href="/availabilities" legacyBehavior>
          <a className="btn-secondary">View All Availabilities</a>
        </Link>
      )}
    </Layout>
  )
}

export async function getStaticProps() {
  const availabilitiesRes = await fetch(`${API_URL}/api/availabilities?populate=*&_sort=bemerkung:ASC&_limit=3`);
  const availabilities = await availabilitiesRes.json();

  return {
    props: { availabilities: availabilities.data },
    revalidate: 1
  };
}
