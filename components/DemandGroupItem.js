import {useState} from "react";
import DemandTableRow from './DemandTableRow';
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";
import styles from '@/styles/DemandGroupItem.module.scss';

export default function DemandGroupItem({group}) {
    const attributes = group.attributes;
    const [rolesVisible, setRolesVisible] = useState(true);
    const [rolesVisibleMobile, setRolesVisibleMobile] = useState(true);

    const handleToggle = e => {
        e.preventDefault();
        setRolesVisible(!rolesVisible);
        setRolesVisibleMobile(!rolesVisibleMobile);
    };

    return (
        <div className={styles.group}>
            <div className={styles.groupInfo}>
                <h2 className="subheading">{attributes.name}</h2>
            </div>
            <div className={styles.containerTable}>
                <table>
                    <thead>
                    <tr className={styles.demandHeader}>
                        <th className={styles.demandDatum}>Datum</th>
                        <th className={styles.demandZeit}>Von</th>
                        <th className={styles.demandZeit}>Bis</th>
                        <th className={styles.demandEinsatz}>Einsatz</th>
                        {rolesVisible && attributes.rollen.map(rolle => (
                            <th className={styles.demandAuswahlRollen} key={rolle.id}>{rolle.name}</th>
                        ))}
                    </tr>
                    <tr className={styles.demandHeaderSmall}>
                        <th className={styles.demandDatum}>Datum</th>
                        <th className={styles.demandZeit}>Von</th>
                        <th className={styles.demandZeit}>Bis</th>
                        <th className={styles.demandEinsatz}>Einsatz</th>
                        {rolesVisibleMobile && attributes.rollen.map(rolle => (
                            <th className={styles.demandAuswahlRollen} key={rolle.id}>{rolle.name}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {attributes.demands.data?.length === 0 &&
                        <tr>
                            <td colspan="5">No demands to show</td>
                        </tr>
                    }
                    {attributes.demands.data?.map(demand => (
                        <DemandTableRow
                            key={demand.id}
                            groupId={group.id}
                            demand={demand}
                            rolesVisible={rolesVisible}
                            rolesVisibleMobile={rolesVisibleMobile}
                            rollen={attributes.rollen}/>
                    ))}
                    </tbody>
                </table>
                <button
                    className={`btn ${styles.btnIcon} ${styles.rolesHorizontally}`}
                    onClick={e => handleToggle(e)}
                    aria-label={`Felder Verfügbarkeiten ${rolesVisibleMobile ? 'zuklappen' : 'aufklappen'}`}>
                    {rolesVisibleMobile ? <IconChevronLeft/> : <IconChevronRight/>}{`Felder Verfügbarkeiten ${rolesVisibleMobile ? 'zuklappen' : 'aufklappen'}`}
                </button>
            </div>

        </div>
    )
}
