import Link from 'next/link';
import {formatTime} from '@/helpers/index';
import styles from '@/styles/AvailabilityItem.module.scss';

export default function AvailabilityItem({availability}) {
    return (
        <div className={styles.availability}>
            <div className={styles.info}>
                <div className={styles.infoTop}>
                    <div>
                        <strong>{new Date(availability.demand?.data.attributes.datum).toLocaleDateString('de-CH')}</strong>&nbsp;
                        {formatTime(availability.demand?.data.attributes.zeitVon)}
                        {availability.demand?.data.attributes.zeitVon && ' - '}
                        {formatTime(availability.demand?.data.attributes.zeitBis)}
                    </div>
                    <div>{availability.benutzer.data.attributes.username}</div>
                </div>
                <div className={styles.details}>
                    <h3>{availability.demand?.data.attributes.einsatztyp.typ}</h3>
                    <div>{availability.rollen?.map(rolle => rolle.name).join(', ')}</div>
                </div>
            </div>

            <div className={styles.link}>
                <Link href={`/availabilities/${availability.slug}`} legacyBehavior>
                    <a className="btn">Details</a>
                </Link>
            </div>
        </div>
    )
}
