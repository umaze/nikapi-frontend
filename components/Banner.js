import {useEffect, useRef} from "react";
import styles from "@/styles/Footer.module.scss";
import Link from "next/link";
export default function Banner() {
    const ref = useRef();
    const onConfirm = e => {
        e.preventDefault();
        document.cookie = "einsatzplanung=true";
        console.log(`ref: ${ref.current.classList}`);
        ref.current?.classList.toggle('hidden');
        console.log(`ref2: ${ref.current.classList}`);
    };

    useEffect(() => {
        if (!document.cookie.split( ';' ).find(s => s.startsWith('einsatzplanung='))) {
            if (ref.current?.classList.contains('hidden')) {
                ref.current?.classList.remove('hidden');
            }
        }
    }, []);

    return (
        <div ref={ref} className="banner hidden">
            <p className="banner__text">Mit Klick auf &laquo;Zustimmen&raquo; erkl&auml;ren Sie sich mit der Verwendung
                von Cookies einverstanden. Mehr erfahren Sie unter
                <Link className="banner-link"
                      href='/datenschutz'>&laquo;Datenschutz&raquo;</Link>.
                Ihre Einwilligung k&ouml;nnen Sie jederzeit mit Wirkung auf die Zukunft widerrufen oder &auml;ndern.</p>
            <button className="btn btn--banner" onClick={e => onConfirm(e)}>Zustimmen</button>
        </div>
    );
}
