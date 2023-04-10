import Layout from "@/components/Layout";
import Link from "next/link";
import {useContext} from "react";
import AuthContext from "@/context/AuthContext";
import {isEinsatzplaner} from "@/helpers/index";

export default function MyActivitiesPage() {
    return (
        <Layout title="Einsätze">
            <h1 className="heading-primary">Meine Eins&auml;tze</h1>
        </Layout>
    )
}