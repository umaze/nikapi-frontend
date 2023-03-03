import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useContext } from 'react';
import Link from 'next/link';
import Search from './Search';
import AuthContext from '@/context/AuthContext';
import styles from '@/styles/Header.module.scss';

export default function Header() {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link href='/' legacyBehavior>
                    <a>Samichlaus</a>
                </Link>
            </div>

            <Search />

            <nav>
                <ul>
                    <li>
                        <Link href='/availabilities' legacyBehavior>
                            <a>Availabilities</a>
                        </Link>
                    </li>
                    {user ? <>
                        <li>
                            <Link href='/availabilities/add' legacyBehavior>
                                <a>Add Availability</a>
                            </Link>
                        </li>
                        <li>
                            <Link href='/demands' legacyBehavior>
                                <a>Demands</a>
                            </Link>
                        </li>
                        <li>
                            <Link href='/account/dashboard' legacyBehavior>
                                <a>Dashboard</a>
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => logout()} className="btn-secondary btn-icon">
                                <FaSignOutAlt />  Logout
                            </button>
                        </li>
                    </> : <>
                        <li>
                            <Link href='/account/login' legacyBehavior>
                                <a className="btn-secondary btn-icon">
                                    <FaSignInAlt /> Login
                                </a>
                            </Link>
                        </li>
                    </>}

                </ul>
            </nav>
        </header>
    )
}
