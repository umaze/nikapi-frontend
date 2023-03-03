import Link from 'next/link';
import { PER_PAGE } from "@/config/index";

export default function Pagination({ page, total }) {
    const lastPage = Math.ceil(total / PER_PAGE);

    return (
        <>
            {page > 1 && (
                <Link href={`/availabilities?page=${page - 1}`} legacyBehavior>
                    <a className="btn-secondary">Prev</a>
                </Link>
            )}

            {page < lastPage && (
                <Link href={`/availabilities?page=${page + 1}`} legacyBehavior>
                    <a className="btn-secondary">Next</a>
                </Link>
            )}
        </>
    )
}
