import cookie from 'cookie';
import { API_URL } from "@/config/index";

export default async (req, res) => {
    if (req.method === "POST") {
        const { identifier, password } = req.body;

        const strapiRes = await fetch(`${API_URL}/api/auth/local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier,
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
            // {
            //     jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjczNTM1MjE5LCJleHAiOjE2NzYxMjcyMTl9.inB56Fh8cMwCqVEaAqTtZNmcq-wZq7tV0hxXfz3JZ3g',
            //     user: {
            //       id: 1,
            //       username: 'John Doe',
            //       email: 'john@test.com',
            //       provider: 'local',
            //       confirmed: true,
            //       blocked: false,
            //       createdAt: '2023-01-07T19:17:30.931Z',
            //       updatedAt: '2023-01-07T19:17:30.931Z'
            //     }
            //   }
        } else if (error) {
            res.status(error.status).json({ message: error.message });
            // {
            //     data: null,
            //     error: {
            //       status: 400,
            //       name: 'ValidationError',
            //       message: 'Invalid identifier or password',
            //       details: {}
            //     }
            //   }
        } else {
            res.status(strapiRes.status).json({ message: strapiRes.statusText });
        }

    } else {
        res.setHeader("Allow", ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` })
    }
};