import InputWrapper from "@/components/InputWrapper";
import SelectWrapper from "@/components/SelectWrapper";
import {getOptions} from "@/helpers/index";
import {EINSATZTYP_ORDER, STATUS_ORDER} from "@/config/index";
import styles from "@/styles/OrderForm.module.scss";
import {useEffect} from "react";

export default function OrderForm({register, errors, order, setValue}) {
    useEffect(() => {
        if (order) {
            setValue('order', {
                bezeichnung: order.bezeichnung,
                adresse: order.adresse,
                auftraggeber: order.auftraggeber,
                kontakt: order.kontakt,
                anzahlKinder: order.anzahlKinder,
                datum: order.datum,
                selectStatus: order.status,
                selectEinsatztyp: order.einsatztyp?.typ,
                bemerkung: order.bemerkung,
            });
        }
    }, []);

    return (
        <>
            <div className={`container grid grid--3-cols ${styles.order}`}>
                <InputWrapper
                    label="Bezeichnung"
                    id="order.bezeichnung"
                    type="text"
                    required
                    placeholder="Kennzeichnung des Einsatzes"
                    register={register}
                    errors={errors} />
                <div className={styles.gridSpan2}>
                    <InputWrapper
                        label="Adresse"
                        id="order.adresse"
                        type="text"
                        required
                        placeholder="Strasse, Hausnummer, PLZ und Ort"
                        register={register}
                        errors={errors} />
                </div>
                <InputWrapper
                    label="Auftraggeber"
                    id="order.auftraggeber"
                    type="text"
                    required
                    placeholder="Vorname Name"
                    register={register}
                    errors={errors} />
                <InputWrapper
                    label="Kontakt"
                    id="order.kontakt"
                    type="text"
                    required
                    placeholder="Vorname Name"
                    register={register}
                    errors={errors} />
                <InputWrapper
                    label="Anzahl Kinder"
                    id="order.anzahlKinder"
                    type="number"
                    required
                    placeholder="-"
                    register={register}
                    errors={errors} />
                <InputWrapper
                    label="Gewünschtes Datum"
                    id="order.datum"
                    type="date"
                    required
                    placeholder=""
                    register={register}
                    errors={errors} />
                <SelectWrapper
                    label="Status"
                    required
                    id="order.selectStatus"
                    options={getOptions(STATUS_ORDER)}
                    register={register}
                    errors={errors}/>
                <SelectWrapper
                    label="Einsatztyp"
                    required
                    id="order.selectEinsatztyp"
                    options={getOptions(EINSATZTYP_ORDER)}
                    register={register}
                    errors={errors}/>
                <div className={styles.gridSpan3}>
                    <InputWrapper
                        label="Bemerkungen"
                        id="order.bemerkung"
                        type="text"
                        placeholder="Was ist zu beachten?"
                        register={register}
                        errors={errors} />
                </div>
            </div>
        </>
    );
}
