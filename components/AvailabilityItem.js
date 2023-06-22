import {formatDate, formatTime} from '@/helpers/index';
import styles from '@/styles/AvailabilityItem.module.scss';

export default function AvailabilityItem({availability}) {
    return (
        <div className={styles.availability}>
            <div className={styles.info}>
                <div className={styles.infoTop}>
                    <div>
                        <strong>{formatDate(availability.demand?.data.attributes.datum)}</strong>&nbsp;
                        {formatTime(availability.demand?.data.attributes.zeitVon)}
                        {availability.demand?.data.attributes.zeitVon && ' - '}
                        {formatTime(availability.demand?.data.attributes.zeitBis)}
                    </div>
                    <div className={styles.mitglied}>{availability.benutzer?.data.attributes.username}</div>
                </div>
                <div className={styles.details}>
                    <div className={styles.einsatztyp}>{availability.demand?.data.attributes.einsatztyp.typ}</div>
                    <div className={styles.rollen}>{availability.rollen?.map(rolle => rolle.name).join(', ')}</div>
                </div>
                <div>
                    <div className={styles.rollenMobile}>{availability.rollen?.map(rolle => rolle.name).join(', ')}</div>
                </div>
            </div>

            {/*<div className={styles.link}>*/}
            {/*    <button className="btn btn-secondary">Details</button>*/}
            {/*</div>*/}
        </div>
    )
}
