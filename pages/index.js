import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from '@/styles/Home.module.scss';

export default function HomePage({ availabilities }) {
  return (
    <Layout>
      <main>

      </main>
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
