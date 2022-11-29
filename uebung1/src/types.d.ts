interface RezeptName {
    name: string
}
interface RezeptDauer {
    dauer: string
}
interface RezeptKosten {
    kosten: string
}
interface RezeptAnleitung {
    anleitung: string
}

interface rezept {
    id: number
    name: string
    dauer: string
    kosten: string
    anleitung: string
}

interface FilterInputValue {
    filterInputValue: string
}

interface FilterRow {
    column: string
    operator: string
    inputValue: string
    hasChanged: boolean
}

interface SortModel {
    field: string
    sort: string
}
