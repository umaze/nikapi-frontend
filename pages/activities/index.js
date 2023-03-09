import Layout from "@/components/Layout";
import Link from "next/link";

export default function ActivitiesPage() {
    return (
        <Layout title="Einsätze">
            <h1 className="heading-primary">Eins&auml;tze</h1>
            <Link className="btn" href={`/activities/add`}>Einsatz hinzuf&uuml;gen</Link>
        </Layout>
    )
}