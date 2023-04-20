import {toast} from 'react-toastify';
import {useContext, useEffect} from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import AuthContext from '@/context/AuthContext';
import InputWrapper from "@/components/InputWrapper";
import {useForm} from "react-hook-form";
import {IconUserPlus} from "@tabler/icons-react";
import styles from '@/styles/AuthForm.module.scss';

export default function RegisterPage() {
    const { register: registerContext, error: errorContext } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    useEffect(() => {
        const show = async () => {
            errorContext && toast.error(`${errorContext}`, {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-error'
            });
        };
        show();
    }, [errorContext]);

    const onSubmit = async data => {
        if (data.password !== data.passwordConfirm) {
            toast.error('Passwörter stimmen nicht überein!', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-error'
            });
            return;
        }
        registerContext({ ...data });
    };

    return (
        <Layout title="Benutzer Registrierung">
            <div className={styles.auth}>
                <h1 className="heading-secondary">
                    <IconUserPlus />Registrieren
                </h1>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.authForm}>

                        <InputWrapper
                            label="E-Mail-Adresse"
                            id="email"
                            type="email"
                            required
                            placeholder="E-Mail-Adresse"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Benutzername"
                            id="username"
                            type="text"
                            required
                            placeholder="Vorname Name"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Passwort"
                            id="password"
                            type="password"
                            required
                            placeholder="Passwort"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Passwort wiederholen"
                            id="passwordConfirm"
                            type="password"
                            required
                            placeholder="Passwort"
                            register={register}
                            errors={errors} />

                        <button className={`btn ${styles.btn}`} type="submit" disabled={!isValid}>Registrieren</button>
                    </div>
                </form>

                <p className={styles.hint}>
                    Bereits einen Account? <Link href='/account/login'>Anmelden</Link>
                </p>
            </div>
        </Layout>
    )
}
