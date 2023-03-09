import Link from 'next/link';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import styles from '@/styles/DashboardAvailability.module.scss';

export default function DashboardAvailability({ availability, handleDelete }) {
    return (
        <div className={styles.availability}>
            <h4>
                <Link href={`/availabilities/${availability.attributes.slug}`}>
                    {availability.attributes.name}
                </Link>
            </h4>
            <Link href={`/availabilities/edit/${availability.id}`}>
                <FaPencilAlt /> <span>Edit Availability</span>
            </Link>
            <a href="#" className={styles.delete} onClick={() => handleDelete(availability.id)}>
                <FaTimes /> <span>Delete</span>
            </a>
        </div>
    )
}
