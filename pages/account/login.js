import {toast} from 'react-toastify';
import {useContext, useEffect} from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import AuthContext from '@/context/AuthContext';
import InputWrapper from "@/components/InputWrapper";
import {useForm} from "react-hook-form";
import {IconUserCheck} from "@tabler/icons-react";
import styles from '@/styles/AuthForm.module.scss';

export default function LoginPage() {
    const { login, error } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm({mode: 'all'});

    useEffect(() => {
        const show = async () => {
            error && toast.error(`${error}`, {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-error'
            });
        };
        show();
    }, [error]);

    const onSubmit = async data => {
        login({ ...data });
    };

    return (
        <Layout title="Benutzer Login">
            <div className={styles.auth}>
                <h1 className="heading-secondary">
                    <IconUserCheck />Anmelden
                </h1>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.authForm}>

                        <InputWrapper
                            label="Benutzername"
                            id="email"
                            type="email"
                            required
                            placeholder="E-Mail-Adresse"
                            register={register}
                            errors={errors} />
                        <InputWrapper
                            label="Passwort"
                            id="password"
                            type="password"
                            autocomplete="off"
                            required
                            placeholder="Passwort eingeben"
                            register={register}
                            errors={errors} />

                    <button className={`btn ${styles.btn}`} type="submit" disabled={!isValid}>Login</button>
                    </div>
                </form>

                <p className={styles.hint}>
                    Noch keinen Account? <Link href='/account/register'>Registrieren</Link>
                </p>
            </div>
        </Layout>
    )
}
