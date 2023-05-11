import {useState} from "react";
import DemandTableRow from './DemandTableRow';
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";
import styles from '@/styles/DemandGroupItem.module.scss';

export default function DemandGroupItem({group}) {
    const attributes = group.attributes;
    const [rolesVisible, setRolesVisible] = useState(true);
    const [rolesVisibleMobile, setRolesVisibleMobile] = useState(false);

    const handleToggle = e => {
        e.preventDefault();
        setRolesVisible(!rolesVisible);
        setRolesVisibleMobile(!rolesVisibleMobile);
    };

    return (
        <div className={styles.group}>
            <div className={styles.groupInfo}>
                <h3 className="subheading">{attributes.name}</h3>
            </div>
            <div className={styles.containerTable}>
                <table>
                    <thead>
                    <tr className={styles.demandHeader}>
                        <td className={styles.demandDatum}>Datum</td>
                        <td className={styles.demandZeit}>Von</td>
                        <td className={styles.demandZeit}>Bis</td>
                        <td className={styles.demandEinsatz}>Einsatz</td>
                        {rolesVisible && attributes.rollen.map(rolle => (
                            <td className={styles.demandAuswahlRollen} key={rolle.id}>{rolle.name}</td>
                        ))}
                    </tr>
                    <tr className={styles.demandHeaderSmall}>
                        <td className={styles.demandDatum}>Datum</td>
                        <td className={styles.demandZeit}>Von</td>
                        <td className={styles.demandZeit}>Bis</td>
                        <td className={styles.demandEinsatz}>Einsatz</td>
                        {rolesVisibleMobile && attributes.rollen.map(rolle => (
                            <td className={styles.demandAuswahlRollen} key={rolle.id}>{rolle.name}</td>
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
                <button className={`btn ${styles.btnIcon}`} onClick={e => handleToggle(e)}>
                    {rolesVisibleMobile ? <IconChevronLeft/> : <IconChevronRight/>}
                </button>
            </div>

        </div>
    )
}
