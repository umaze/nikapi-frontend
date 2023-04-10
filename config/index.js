import {IconCheckbox, IconClipboardList} from "@tabler/icons-react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';
export const NEXT_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

export const PER_PAGE = 5;
export const STATUS_ACTIVITY = ['offen', 'bereit', 'erledigt', 'inaktiv'];
export const STATUS_ORDER = ['offen', 'zugewiesen', 'erledigt', 'inaktiv'];
export const MAIN_MENU = [{id: 'meinBereich', label: 'Mein Bereich'}, {id: 'planung', label: 'Planung'}];

export const SUB_MENU = {
    meinBereich : [
        {
            href: '/activities/me',
            label: 'Einsätze',
            icon: <IconClipboardList/>
        },
        {
            href: '/availabilities/me',
            label: 'Verfügbarkeiten',
            icon: <IconCheckbox/>
        }
    ],
    planung : [{
            href: '/activities',
            label: 'Einsätze',
            icon: <IconClipboardList/>
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
            icon: <IconClipboardList/>,
            restricted: true
        }
    ]
};