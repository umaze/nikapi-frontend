import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NEXT_URL } from "@/config/index";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const router = useRouter();

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
            router.push('/account/dashboard');
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
            router.push('/account/dashboard');
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
            router.push('/');
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