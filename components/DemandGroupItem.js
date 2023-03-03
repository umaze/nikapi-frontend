import DemandItem from './DemandItem';
import styles from '@/styles/DemandItem.module.scss';

export default function DemandGroupItem({ group }) {
    const attributes = group.attributes;

    return (
        <div className={styles.group}>
            <div className={styles.info}>
                <h3>{attributes.name}</h3>
            </div>
            <table>
                <thead>
                    <tr>
                        <td className={styles.datum}>Datum</td>
                        <td className={styles.zeit}>Von</td>
                        <td className={styles.zeit}>Bis</td>
                        <td className={styles.einsatz}>Einsatz</td>
                        {attributes.rollen.map(rolle => (
                            <td key={rolle.id}>{rolle.name}</td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {attributes.demands.data?.length === 0 && <tr><td colspan="5">No demands to show</td></tr>}
                    {attributes.demands.data?.map(demand => (
                        <DemandItem
                            key={demand.id}
                            groupId={group.id}
                            demand={demand}
                            rollen={attributes.rollen} />
                    ))}
                </tbody>
            </table>

        </div>
    )
}
