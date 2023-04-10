import {createContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {MAIN_MENU, NEXT_URL} from "@/config/index";
import {useDispatch} from "react-redux";
import {setActivatedNavMenu} from "@/store/applicationSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const check = async () => checkUserLoggedIn();
        check();
    }, []);

    // Register user
    const register = async (user) => {
        setError(null);

        const res = await fetch(`${NEXT_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await res.json();

        if (res.ok) {
            setUser(data.user);
            dispatch(setActivatedNavMenu(MAIN_MENU[0].id));
            await router.push('/availabilities/me');
        } else {
            setError(data.message);
            // setError('');
        }
    };

    // Login user
    const login = async ({ email: identifier, password }) => {
        setError(null);

        const res = await fetch(`${NEXT_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier,
                password
            })
        });

        const data = await res.json();

        if (res.ok) {
            setUser(data.user);
            await checkUserLoggedIn();
            dispatch(setActivatedNavMenu(MAIN_MENU[0].id));
            await router.push('/activities/me');
        } else {
            setError(data.message);
            // setError('');
        }
    };

    // Logout user
    const logout = async () => {
        const res = await fetch(`${NEXT_URL}/api/logout`, {
            method: 'POST',
        });

        if (res.ok) {
            setUser(null);
            await router.push('/');
        }
    };

    // Check if user is logged into
    const checkUserLoggedIn = async (user) => {
        const res = await fetch(`${NEXT_URL}/api/user`);
        const data = await res.json();

        if (res.ok) {
            setUser(data.user);
        } else {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;