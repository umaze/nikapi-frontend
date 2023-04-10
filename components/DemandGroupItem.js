import DemandTableRow from './DemandTableRow';
import styles from '@/styles/DemandGroupItem.module.scss';

export default function DemandGroupItem({group}) {
    const attributes = group.attributes;

    return (
        <div className={styles.group}>
            <div className={styles.groupInfo}>
                <h3  className="subheading">{attributes.name}</h3>
            </div>
            <table>
                <thead>
                <tr className={styles.demandHeader}>
                    <td className={styles.demandDatum}>Datum</td>
                    <td className={styles.demandZeit}>Von</td>
                    <td className={styles.demandZeit}>Bis</td>
                    <td className={styles.demandEinsatz}>Einsatz</td>
                    {attributes.rollen.map(rolle => (
                        <td className={styles.demandAuswahlRollen} key={rolle.id}>{rolle.name}</td>
                    ))}
                </tr>
                </thead>
                <tbody>
                {attributes.demands.data?.length === 0 && <tr>
                    <td colspan="5">No demands to show</td>
                </tr>}
                {attributes.demands.data?.map(demand => (
                    <DemandTableRow
                        key={demand.id}
                        groupId={group.id}
                        demand={demand}
                        rollen={attributes.rollen}/>
                ))}
                </tbody>
            </table>

        </div>
    )
}
