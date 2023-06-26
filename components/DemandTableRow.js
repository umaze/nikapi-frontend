import {formatDate, formatTime} from '@/helpers/index';
import {useDispatch, useSelector} from 'react-redux';
import {updateAvailability, selectAvailabilities} from '@/store/availabilitySlice';
import styles from '@/styles/DemandTableRow.module.scss';

export default function DemandTableRow({groupId, demand, rolesVisible, rolesVisibleMobile, rollen}) {
    const attributes = demand.attributes;
    const dispatch = useDispatch();
    const selectedRoles = useSelector(selectAvailabilities).filter(selected => selected.groupId === groupId);
    const isChecked = (demandId, rolleName) => selectedRoles.some(item => +item.demandId === demandId && item.name === rolleName);

    const handleInputChange = (e) => {
        e.preventDefault();
        const {name, id, checked} = e.target;
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
        <>
            <tr className={styles.demandRow}>
                <td className={styles.demandDatum}>{formatDate(attributes.datum)}</td>
                <td className={styles.demandZeit}>{formatTime(attributes.zeitVon)}</td>
                <td className={styles.demandZeit}>{formatTime(attributes.zeitBis)}</td>
                <td className={styles.demandEinsatz}>{attributes.einsatztyp?.typ}</td>
                {rolesVisible && rollen?.map(rolle => (
                    <td className={`${styles.auswahlCell}  ${styles.rolesHorizontally}`} key={rolle.id}>
                        <input
                            className={styles.auswahlBox}
                            id={`${demand.id}-${rolle.name}`}
                            aria-label={`${attributes.datum} ${attributes.zeitVon} ${attributes.einsatztyp?.name} ${rolle.name}`}
                            type="checkbox"
                            name={rolle.name}
                            checked={isChecked(demand.id, rolle.name)}
                            onChange={handleInputChange}/>
                    </td>
                ))}
            </tr>
            <tr className={styles.demandRowSmall}>
                <td className={styles.demandDatum}>{formatDate(attributes.datum)}</td>
                <td className={styles.demandZeit}>{formatTime(attributes.zeitVon)}</td>
                <td className={styles.demandZeit}>{formatTime(attributes.zeitBis)}</td>
                <td className={styles.demandEinsatz}>{attributes.einsatztyp?.typ}</td>
                {rolesVisibleMobile && rollen?.map(rolle => (
                    <td className={`${styles.auswahlCell}  ${styles.rolesHorizontally}`} key={rolle.id}>
                        <input
                            className={styles.auswahlBox}
                            id={`${demand.id}-${rolle.name}`}
                            aria-label={`${attributes.datum} ${attributes.zeitVon} ${attributes.einsatztyp?.name} ${rolle.name}`}
                            type="checkbox"
                            name={rolle.name}
                            checked={isChecked(demand.id, rolle.name)}
                            onChange={handleInputChange}/>
                    </td>
                ))}
            </tr>

            {rolesVisible &&
                <tr className={styles.demandRowSmallVertically}>
                    <td>Rollen:</td>
                </tr>}
            {rolesVisible && rollen.map(rolle => (
                <tr className={styles.demandRowSmallVertically} key={rolle.id}>
                    <td>{rolle.name}</td>
                    <td className={styles.auswahlCell} key={rolle.id}>
                        <input
                            className={styles.auswahlBox}
                            id={`${demand.id}-${rolle.name}`}
                            aria-label={`${attributes.datum} ${attributes.zeitVon} ${attributes.einsatztyp?.name} ${rolle.name}`}
                            type="checkbox"
                            name={rolle.name}
                            checked={isChecked(demand.id, rolle.name)}
                            onChange={handleInputChange}/>
                    </td>
                </tr>
            ))}
        </>
    )
}
