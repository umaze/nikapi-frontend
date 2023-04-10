import { formatTime } from '@/helpers/index';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvailability, selectAvailabilities } from '@/store/availabilitySlice';
import styles from '@/styles/DemandTableRow.module.scss';

export default function DemandTableRow({ groupId, demand, rollen }) {
    const attributes = demand.attributes;
    const dispatch = useDispatch();
    const selectedRoles = useSelector(selectAvailabilities).filter(selected => selected.groupId === groupId);
    const isChecked = (demandId, rolleName) => selectedRoles.some(item => +item.demandId === demandId && item.name === rolleName);

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, id, checked } = e.target;
        const splitted = id.split("-");
        dispatch(
            updateAvailability({
                id: 0,
                groupId,
                demandId: splitted[0],
                name,
                checked
            })
        );
    };

    return (
        <tr className={styles.demandRow}>
            <td className={styles.demandDatum}>{new Date(attributes.datum).toLocaleDateString('de-CH')}</td>
            <td className={styles.demandZeit}>{formatTime(attributes.zeitVon)}</td>
            <td className={styles.demandZeit}>{formatTime(attributes.zeitBis)}</td>
            <td className={styles.demandEinsatz}>{attributes.einsatztyp?.typ}</td>
            {rollen?.map(rolle => (
                <td className={styles.auswahlCell} key={rolle.id}>
                    <input
                        className={styles.auswahlBox}
                        id={`${demand.id}-${rolle.name}`}
                        type="checkbox"
                        name={rolle.name}
                        checked={isChecked(demand.id, rolle.name)}
                        onChange={handleInputChange} />
                </td>
            ))}
        </tr>
    )
}
