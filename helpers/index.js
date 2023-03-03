import cookie from 'cookie';
import {toast} from "react-toastify";

export function parseCookies(req) {
    return cookie.parse(req ? req.headers.cookie || '' : '');
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

export function handleErrorMessage(res) {
    if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
            toast.error('Unauthorized');
            return;
        }
        toast.error('Something Went Wrong');
    }
}
