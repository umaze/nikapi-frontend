import {toast} from 'react-toastify';
import {API_URL} from '../config';
import {useForm} from "react-hook-form";
import {handleErrorMessage} from "@/helpers/index";
import styles from '@/styles/Deletion.module.scss';

export default function Deletion({id, endpoint, onDone, onCancel, token, children}) {
    const {
        handleSubmit
    } = useForm({mode: 'all'});

    const onSubmit = async () => {

        const res = await fetch(`${API_URL}/api/${endpoint}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!res.ok) {
            handleErrorMessage(res, toast);
        } else {
            toast.success(`Eintrag erfolgreich entfernt`, {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-success'
            });
        }
        onDone();
    };

    return (
        <div>
            <form className={`form ${styles.deletion}`} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.content}>{children}</div>
                <div className={styles.btnGroup}>
                    <button type="submit" className="btn">Entfernen</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Abbrechen</button>
                </div>
            </form>
        </div>
    );
}
