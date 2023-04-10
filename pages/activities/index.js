import Layout from "@/components/Layout";
import Link from "next/link";
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";
import {isEinsatzplaner} from "@/helpers/index";

export default function ActivitiesPage() {
    const {user} = useContext(AuthContext);
    return (
        <Layout title="Einsätze">
            <h1 className="heading-primary">Eins&auml;tze</h1>
            {isEinsatzplaner(user) && <Link className="btn" href={`/activities/add`}>Einsatz hinzuf&uuml;gen</Link>}
        </Layout>
    )
}