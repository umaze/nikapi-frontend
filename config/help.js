export const listQuestionAndAnswer = [
    {
        topic: {
            name: 'Verfügbarkeiten',
            list: [
                {
                    number: '01',
                    question: 'Was ist eine Verfügbarkeit?',
                    answer: 'Ein Mitglied gibt seine Verfügbarkeiten an, indem es eine oder mehrere Rollen einer Veranstaltung auswählt. Anhand der Verfügbarkeiten steht dem Einsatzplaner das entsprechende Mitglied für einen Einsatz zur Verfügung.'
                },
                {
                    number: '02',
                    question: 'Wo gebe ich meine Verfügbarkeit an?',
                    answer: 'Im Menu \'Mein Bereich\' ist angemeldeten Benutzern das Untermenu \'Meine Verfügbarkeiten\' angezeigt. Dort sind die Verfügbarkeiten des angemeldeten Benutzers aufgelistet. Mittels Button \'Verfügbarkeiten verwalten\' können Verfügbarkeiten erfasst, geändert oder gelöscht werden.'
                },
                {
                    number: '03',
                    question: 'Wie viele Verfügbarkeiten muss ich angeben?',
                    answer: 'Je mehr Verfügbarkeiten vorhanden sind, desto einfacher ist die Erstellung der Einsätze für den Einsatzplaner! Für eine Veranstaltung kann ein Mitglied mehrere Rollen auswählen. Welche für einen Einsatz verwendet wird, entscheided der Einsatzplaner.'
                },
                {
                    number: '04',
                    question: 'Was ist der Unterschied \'Meine Verfügbarkeiten\' zu \'Verfügbarkeiten\'?',
                    answer: 'Die Filterung ist der Unterschied: \'Meine Verfügbarkeiten\' sind die vorhandenen Verfügbarkeiten mit Bezug zum angemeldeten Benutzer und unter \'Verfügbarkeiten\' sind alle Verfügbarkeiten aufgelistet. Diese können nach verschiedenen Filterkriterien eingeschränkt werden. \'Verfügbarkeiten\' sind nur dem Einsatzplaner angezeigt.'
                },
                {
                    number: '05',
                    question: 'Wie sind die Veranstaltungen gruppiert?',
                    answer: 'Die Veranstaltungen sind nach benötigten Rollen gruppiert. Die Gruppierungen sind aktuell fix vorgegeben und können durch einen Superadmin in der Datenbank verwaltet werden.'
                }
            ]
        }
    },
    {
        topic: {
            name: 'Einsätze',
            list: [
                {
                    number: '01',
                    question: 'Was ist ein Einsatz?',
                    answer: 'Um die Veranstaltungen mit den benötigten Rollen zu planen, gibt es Einsätze. Einem Einsatz werden den benötigten Rollen die verfügbaren Mitglieder zugewiesen.'
                },
                {
                    number: '02',
                    question: 'Wieso kann ich keinen Einsatz erfassen oder bearbeiten?',
                    answer: 'Die Bearbeitung von Einsätzen ist aus organisatorischen Gründen dem Einsatzplaner vorbehalten.'
                },
                {
                    number: '03',
                    question: 'Wie gehe ich vor, wenn ich einen Einsatz ändern möchte?',
                    answer: 'Ein Änderung ist dem Einsatzplaner über die bewährten Hilfsmittel mitzuteilen: Telefon, E-Mail, Besuch und weitere. Der Einsatzplaner nimmt die Änderungen vor. Die Änderungen sind unmittelbar nach Speicherung ersichtlich.'
                },
                {
                    number: '04',
                    question: 'Was ist der Unterschied \'Meine Einsätze\' zu \'Einsätze\'?',
                    answer: 'Die Filterung ist der Unterschied: \'Meine Einsätze\' sind die vorhandenen Einsätze mit Bezug zum angemeldeten Benutzer und unter \'Einsätze\' sind alle Einsätze aufgelistet. Diese können nach verschiedenen Filterkriterien eingeschränkt werden.'
                }
            ]
        }
    },
    {
        topic: {
            name: 'Hausbesuche / Schulbesuche',
            list: [
                {
                    number: '01',
                    question: 'Was sind Hausbesuche?',
                    answer: 'Hausbesuche basieren auf eingegangene Bestellungen. Ein Einsatz hat mehrere Hausbesuche, welche als Tour vollzogen werden.'
                },
                {
                    number: '02',
                    question: 'Was sind Schulbesuche?',
                    answer: 'Schulbesuche basieren ebenfalls auf eingegangene Bestellungen. Eine Bestellung bezieht sich auf genau eine Klasse. Mehrere Klassen werden in einem Einsatz zusammengefasst. Idealerweise findet ein Einsatz in einem Schulhaus statt.'
                },
                {
                    number: '03',
                    question: 'Was sind Bestellungen?',
                    answer: 'Eine Klasse, eine Familie oder eine Organisation gibt über ein Formular einen Auftrag. Ein solcher Auftrag wird durch den Einsatzplaner als Bestellung erfasst. Die Bestellungen stehen dann für den Einsatztyp Hausbesuche und Schulbesuche zur Verfügung.'
                }
            ]
        }
    },
    {
        topic: {
            name: 'Einsatzplaner (Admin)',
            list: [
                {
                    number: '01',
                    question: 'Was ist ein Einsatzplaner?',
                    answer: 'Der Einsatzplaner agiert als Organisator. Er verfügt über mehr Berechtigung und erstellt die Einsätze, erfasst Bestellung für Haus-/Schulbesuche und verwaltet Veranstaltungen.'
                }
            ]
        }
    }
];
