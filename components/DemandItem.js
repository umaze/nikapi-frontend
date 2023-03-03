import { applyTimeToDate } from '@/helpers/index';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvailability, selectAvailabilities } from '@/store/availabilitySlice';
import styles from '@/styles/DemandItem.module.scss';

export default function DemandItem({ groupId, demand, rollen }) {
    const attributes = demand.attributes;
    const dispatch = useDispatch();
    const selectedRoles = useSelector(selectAvailabilities).filter(selected => selected.groupId === groupId);
    const formatTime = time => applyTimeToDate(time)?.toLocaleTimeString('de-CH', { hour: "2-digit", minute: "2-digit" });
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
        <tr>
            <td>{new Date(attributes.datum).toLocaleDateString('de-CH')}</td>
            <td>{formatTime(attributes.zeitVon)}</td>
            <td>{formatTime(attributes.zeitBis)}</td>
            <td>{attributes.einsatztyp?.typ}</td>
            {rollen?.map(rolle => (
                <td className={styles.auswahlcell} key={rolle.id}>
                    {isChecked(demand.id, rolle.name)}
                    <input
                        className={styles.auswahlbox}
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
