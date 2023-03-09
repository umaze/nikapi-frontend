import Layout from "@/components/Layout";
import Link from "next/link";

export default function ActivitiesPage() {
    return (
        <Layout title="Einsätze">
            <h1>Eins&auml;tze</h1>

            <Link href={`/activities/add`} legacyBehavior>
                <a className="btn">Einsatz hinzuf&uuml;gen</a>
            </Link>
        </Layout>
    )
}