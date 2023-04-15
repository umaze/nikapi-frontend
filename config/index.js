import {IconCheckbox, IconClipboardList, IconBuildingCircus, IconShoppingCart} from "@tabler/icons-react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';
export const NEXT_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

export const PER_PAGE = 5;
export const STATUS_ACTIVITY = ['offen', 'bereit', 'erledigt', 'inaktiv'];
export const STATUS_ORDER = ['offen', 'zugewiesen', 'erledigt', 'inaktiv'];
export const EINSATZTYP_ORDER = ['Abend', 'Schulen Vormittag', 'Schulen Nachmittag'];
export const EINSATZTYP_ALL = [...EINSATZTYP_ORDER, 'Weihnachtsmarkt', 'Waldhütte', 'Kath. Kirche', 'Lokal einrichten', 'Lokal aufräumen', 'Aufbau Markt', 'Abbau Markt'];
export const MAIN_MENU = [{id: 'meinBereich', label: 'Mein Bereich'}, {id: 'planung', label: 'Planung'}];

export const SUB_MENU = {
    meinBereich: [
        {
            href: '/activities/me',
            label: 'Einsätze',
            icon: <IconClipboardList/>
        },
        {
            href: '/availabilities/me',
            label: 'Verfügbarkeiten',
            icon: <IconCheckbox/>,
            additionals: ['/manage']
        }
    ],
    planung: [
        {
            href: '/activities',
            label: 'Einsätze',
            icon: <IconClipboardList/>,
            additionals: ['/add']
        },
        {
            href: '/availabilities',
            label: 'Verfügbarkeiten',
            icon: <IconCheckbox/>,
            restricted: true
        },
        {
            href: '/demands',
            label: 'Veranstaltungen',
            icon: <IconBuildingCircus/>,
            restricted: true,
            additionals: ['/add']
        },
        {
            href: '/orders',
            label: 'Bestellungen',
            icon: <IconShoppingCart/>,
            restricted: true,
            additionals: ['/add']
        }
    ]
};