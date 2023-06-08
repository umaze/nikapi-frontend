import cookie from 'cookie';

export function parseCookies(req) {
    return cookie.parse(req ? req.headers.cookie || '' : '');
}

export function isEinsatzplaner(user) {
    return user && user.role?.name === 'Einsatzplaner';
}

export function applyTimeToDate(source) {
    const currentDate = new Date();
    const arrTime = source?.split(':');
    if (source) {
        currentDate.setHours(arrTime[0], arrTime[1]);
        return currentDate;
    }
    return null;
}

export const formatTime = time => applyTimeToDate(time)?.toLocaleTimeString('de-CH', {
    hour: "2-digit",
    minute: "2-digit"
});

export const formatDate = value => {
    if (value) {
        return new Date(value).toLocaleDateString('de-CH', { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    return '';
};

export function groupSelectedRolesByDemandId(list) {
    const grouped = [];

    list.reduce((groupedList, input) => {
        if (!groupedList[input.demandId]) {
            groupedList[input.demandId] = {id: input.id, demandId: input.demandId, rollen: []};
            grouped.push(groupedList[input.demandId]);
        }
        groupedList[input.demandId].rollen?.push(input.name);
        groupedList[input.demandId].groupId = input.groupId;
        groupedList[input.demandId].id = input.id || groupedList[input.demandId].id;
        return groupedList;
    }, {});

    return grouped;
}

function getDifferentRoles(listA, listB) {
    return listA && listB ? listA.filter(roleA => !listB.some(roleB => roleA === roleB)) : [];
}

function hasUpdatedRoles(current, persisted) {
    const persistedMapped = persisted?.map(rolle => rolle.name);
    return current && persistedMapped && [
        ...getDifferentRoles(current, persistedMapped),
        ...getDifferentRoles(persistedMapped, current)
    ].length > 0;
}

export function getDifferentSelections(listCurrent, listPersisted) {
    return listCurrent && listPersisted ? listCurrent.filter(current => !listPersisted.some(
        persisted => +current.groupId === +persisted.groupId && +current.demandId === +persisted.demandId
    )) : [];
}

export const getRoleNameOfSelectable = selectable => Object.keys(selectable)[0]?.split('_')[0];

export function getUnselectedRoles(listRoles, listSelected) {
    return listRoles?.filter(
        role => !listSelected.some(
            selected => role.name?.toLowerCase() === getRoleNameOfSelectable(selected)
        )
    );
}

export function getNewSelectables(listAdditional, listCurrent) {
    return listAdditional.filter(
        additional => !listCurrent.some(
            current => Object.keys(additional)[0] === Object.keys(current)[0]
        )
    );
}

export function getMatchingSelectionsWithUpdates(listCurrent, listPersisted) {
    return listCurrent
        .filter(current => listPersisted.some(
            persisted => +current.groupId === +persisted.groupId && +current.demandId === +persisted.demandId && hasUpdatedRoles(current.rollen, persisted.rollen)
        ))
        .map(current => {
            const mapped = {...current};
            const matching = listPersisted.find(persisted => +current.groupId === +persisted.groupId && +current.demandId === +persisted.demandId);
            mapped.id = matching ? matching.id : 0;
            return mapped;
        });
}

export const configRequest = (method, token, body = null, contentType = null) => {
    return {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body
    };
};

export function handleErrorMessage(res, toast, customId = null) {
    if (!toast) return;

    if (!res.ok) {
        const config = {
            position: toast.POSITION.TOP_CENTER,
            className: 'toast-error',
            toastId: customId
        };
        if (res.status === 403 || res.status === 401) {
            toast.error('Nicht authorisiert', config);
            return;
        }
        toast.error('Ein Fehler ist aufgetreten', config);
    }
}

export function parseFormDataToValidProperties(data) {
    return Object.keys(data)?.map(item => {
        let formatted = {};
        const value = data[item];
        if (item.startsWith('select')) {
            const withoutPrefix = item.slice(6).toLowerCase();
            if (~item.indexOf('_')) {
                // Key like selecthelfer_0
                formatted[withoutPrefix.split('_')[0]] = value;
            } else {
                // Key like selectStatus
                formatted[withoutPrefix] = value;
            }
        } else {
            if (item.startsWith('anzahl') || item.startsWith('zeit')) {
                // Key like anzahlKinder or zeitVon
                formatted[item] = value;
            } else {
                // Key like Bezeichnung
                formatted[item.toLowerCase()] = value;
            }
        }
        return formatted;
    });
}

export function applyPropertiesToActivityObject(parsed, rollen) {
    const applied = {};
    applied.rollen = [];
    applied.orders = [];
    Object.entries(parsed).forEach(([k, v]) => {
        const [key, value] = Object.entries(v)[0];
        if (rollen.some(r => r.name.toLowerCase() === key)) {
            // Apply only selected roles
            if (!!+value) {
                // Role names are capitalized: e.g. Helfer
                const rolleName = key?.charAt(0).toUpperCase() + key.slice(1);
                applied.rollen.push(
                    {
                        rolle: {
                            name: rolleName
                        },
                        availability: +value
                    });
            }
        } else {
            if (key === 'orders') {
                applied.orders = value.data.map(o => o.id);
            } else {
                applied[key] = key === 'demand' ? +value : value;
            }
        }
    });
    return applied;
}

export function applyPropertiesToOrderObject(parsed) {
    const applied = {};
    Object.entries(parsed).forEach(([k, v]) => {
        const [key, value] = Object.entries(v)[0];
        if (key === 'einsatztyp') {
            applied[key] = {typ: value};
        } else if (key.startsWith('anzahl')) {
            applied[key] = Number.isNaN(value) ? 0 : +value;
        } else {
            applied[key] = value;
        }
    });
    return applied;
}

export function applyPropertiesToDemandObject(parsed) {
    const applied = {};
    Object.entries(parsed).forEach(([k, v]) => {
        const [key, value] = Object.entries(v)[0];
        if (key === 'einsatztyp') {
            applied[key] = {typ: value};
        } else {
            applied[key] = key === 'gruppe' ? +value : value;
        }
    });
    return applied;
}

export function checkActivatedRoute(currentRoute, routes) {
    return routes.some(route =>
        route.endsWith('/') ?
            currentRoute.includes(route) :
            currentRoute.endsWith(route)
    );
}

export function checkRouteMeinBereich(currentRoute) {
    return checkActivatedRoute(currentRoute, ['/me', '/me/manage']);
}

export function checkRouteHilfe(currentRoute) {
    return checkActivatedRoute(currentRoute, ['/account/help']);
}

export function checkRouteEinsaetze(currentRoute) {
    return checkActivatedRoute(currentRoute,
        [
            '/activities',
            '/activities/add',
            '/activities/edit/'
        ]);
}

export function checkRouteAdmin(currentRoute) {
    return checkActivatedRoute(currentRoute,
        [
            '/availabilities',
            '/demands',
            '/orders',
            '/orders/add',
            '/demands/add',
            '/demands/edit/',
            '/orders/edit/'
        ]);
}

export function getOptions(options) {
    return (
        <>
            {options && options.map((option, i) => (
                <option key={i} defaultValue={options[0]} value={option}>{option}</option>
            ))}
        </>
    )
}
