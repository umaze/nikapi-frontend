import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Layout from "@/components/Layout";
import { API_URL } from '@/config/index';
import styles from '@/styles/Availability.module.scss';
import { useRouter } from 'next/router';

export default function AvailabilityPage({ availability }) {
    const router = useRouter();

    const deleteAvailability = async (e) => {
        if (confirm('Are you sure?')) {
            const res = await fetch(`${API_URL}/api/availabilities/${availability.id}`, {
                method: 'DELETE'
            });

            const data = res.json();

            if (!res.ok) {
                toast.error(data.message);
            } else {
                router.push('/availabilities');
            }
        }
    };

    return (
        <Layout>
            <div className={styles.event}>
                <div className={styles.controls}>
                    <Link href={`/availabilities/edit/${availability.id}`} legacyBehavior>
                        <a>
                            <FaPencilAlt /> Edit Availability
                        </a>
                    </Link>
                    <a href="#" className={styles.delete} onClick={deleteAvailability}>
                        <FaTimes /> Delete Availability
                    </a>
                </div>

                <span>
                    {new Date(availability.date).toLocaleDateString('de-CH')} at {availability.time}
                </span>
                <h1>{availability.name}</h1>
                <ToastContainer />
                {availability.image.data && (
                    <div className={styles.image}>
                        <Image src={availability.image.data.attributes.formats.medium.url}
                            width={960}
                            height={600}
                            alt={availability.name} />
                    </div>
                )}

                <h3>Performers:</h3>
                <p>{availability.performers}</p>
                <h3>Description:</h3>
                <p>{availability.description}</p>
                <h3>Venue: {availability.venue}</h3>
                <p>{availability.address}</p>

                <Link href="/availabilities" legacyBehavior>
                    <a className={styles.back}>
                        {'<'} Go Back
                    </a>
                </Link>
            </div>
        </Layout>
    )
}

export async function getStaticPaths() {
    const res = await fetch(`${API_URL}/api/availabilities`);
    const availabilities = await res.json();

    const paths = availabilities.data.map((availability) => ({
        params: { slug: availability.attributes.slug }
    }));

    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params: { slug } }) {
    const res = await fetch(`${API_URL}/api/availabilities?filters[slug][$eq]=${slug}&populate=*`);
    const availabilities = await res.json();

    return {
        props: {
            availability: {
                id: availabilities.data[0].id,
                ...availabilities.data[0].attributes
            }
        },
        revalidate: 1
    }
}

// export async function getServerSideProps({ query: { slug } }) {
//     const res = await fetch(`${API_URL}/api/events/${slug}`);
//     const events = await res.json();

//     return {
//         props: {
//             evt: events[0]
//         }
//     }
// }
