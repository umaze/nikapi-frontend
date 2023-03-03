import { format } from 'date-fns';
import { FaImage } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parseCookies } from '@/helpers/index';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import ImageUpload from '@/components/ImageUpload';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.scss';

export default function EditAvailabilityPage({ availability, token }) {
    const [values, setValues] = useState({
        name: availability.name,
        performers: availability.performers,
        venue: availability.venue,
        address: availability.address,
        date: availability.date,
        time: availability.time,
        description: availability.description
    });

    const [imagePreview, setImagePreview] = useState(availability.image.data ? availability.image.data.attributes.formats.thumbnail.url : null);
    const [showModal, setShowModal] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validateion
        const hasEmptyFields = Object.values(values).some(element => element === '');

        if (hasEmptyFields) {
            toast.error('Please fill in all fields');
        }

        const data = { data: { ...values } };
        const res = await fetch(`${API_URL}/api/availabilities/${availability.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            if (res.status === 403 || res.status === 401) {
                toast.error('Unauthorized');
                return;
            }
            toast.error('Something Went Wrong');
        } else {
            const availability = await res.json();
            router.push(`/availabilities/${availability.data.attributes.slug}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const imageUploaded = async (e) => {
        const res = await fetch(`${API_URL}/api/availabilities/${availability.id}?populate=*`);
        const availability = await res.json();
        setImagePreview(availability.data.attributes.image.data.attributes.formats.thumbnail.url);
        setShowModal(false);
    };

    return (
        <Layout title="Edit Availability">
            <Link href="/availabilities">Go Back</Link>
            <h1>Edit Availability</h1>
            <ToastContainer />

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div>
                        <label htmlFor="name">Event Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={values.name}
                            onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='performers'>Performers</label>
                        <input
                            type='text'
                            name='performers'
                            id='performers'
                            value={values.performers}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='venue'>Venue</label>
                        <input
                            type='text'
                            name='venue'
                            id='venue'
                            value={values.venue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='address'>Address</label>
                        <input
                            type='text'
                            name='address'
                            id='address'
                            value={values.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='date'>Date</label>
                        <input
                            type='date'
                            name='date'
                            id='date'
                            value={format(new Date(values.date.toString()), 'yyyy-MM-dd')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='time'>Time</label>
                        <input
                            type='text'
                            name='time'
                            id='time'
                            value={values.time}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor='description'>Event Description</label>
                    <textarea
                        type='text'
                        name='description'
                        id='description'
                        value={values.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

                <input type="submit" value="Update Availability" className="btn" />
            </form>

            <h2>Availability Image</h2>
            {imagePreview ? (
                <Image src={imagePreview} height={100} width={170} alt={availability.name} />
            ) : <div>
                <p>No image uploaded</p>
            </div>
            }

            <div>
                <button className="btn-secondary" onClick={() => setShowModal(true)}>
                    <FaImage /> Set Image
                </button>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <ImageUpload evtId={availability.id} imageUploaded={imageUploaded} token={token} />
            </Modal >
        </Layout >
    )
}

export async function getServerSideProps({ params: { id }, req }) {
    const { token } = parseCookies(req);

    const res = await fetch(`${API_URL}/api/availabilities/${id}?populate=*`);
    const availability = await res.json();

    return {
        props: {
            availability: {
                id: availability.data.id,
                ...availability.data.attributes
            },
            token
        }
    };
}
