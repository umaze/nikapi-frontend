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

export const formatTime = time => applyTimeToDate(time)?.toLocaleTimeString('de-CH', { hour: "2-digit", minute: "2-digit" });

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
        ));
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

export function handleErrorMessage(res, toast) {
    if (!toast) return;

    if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
            toast.error('Unauthorized');
            return;
        }
        toast.error('Something Went Wrong');
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
            // Key like Bezeichnung
            formatted[item.toLowerCase()] = value;
        }
        return formatted;
    });
}

export function applyPropertiesToActivityObject(parsed, rollen) {
    const applied = {};
    applied.rollen = [];
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
            applied[key] = key === 'demand' ? +value : value;
        }
    });
    return applied;
}

export function checkActivatedRoute(currentRoute, routes) {
    return routes.some(route => currentRoute.endsWith(route));
}

export function checkRouteMeinBereich(currentRoute) {
    return checkActivatedRoute(currentRoute, ['/me', '/me/manage']);
}

export function checkRoutePlanung(currentRoute) {
    return checkActivatedRoute(currentRoute, ['/activities', '/availabilities', '/demands', '/orders', '/activities/add']);
}
