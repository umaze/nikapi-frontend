import cookie from 'cookie';
import { API_URL } from "@/config/index";

export default async (req, res) => {
    if (req.method === "POST") {
        const { username, email, password } = req.body;

        const strapiRes = await fetch(`${API_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const { jwt, user, error } = await strapiRes.json();

        if (user) {
            // Set cookie
            res.setHeader(
                'Set-Cookie',
                cookie.serialize(
                    'token',
                    jwt,
                    {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        maxAge: 60 * 60 * 24 * 7, // 1 week
                        sameSite: 'strict',
                        path: '/'
                    }
                ));
            res.status(200).json({ user });
        } else if (error) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(strapiRes.status).json({ message: strapiRes.statusText });
        }

    } else {
        res.setHeader("Allow", ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` })
    }
};
