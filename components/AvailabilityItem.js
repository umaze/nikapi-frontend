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
                    <div>{availability.benutzer?.data.attributes.username}</div>
                </div>
                <div className={styles.details}>
                    <div className={styles.einsatztyp}>{availability.demand?.data.attributes.einsatztyp.typ}</div>
                    <div>{availability.rollen?.map(rolle => rolle.name).join(', ')}</div>
                </div>
            </div>

            <div className={styles.link}>
                <button className="btn btn-secondary">Details</button>
            </div>
        </div>
    )
}
