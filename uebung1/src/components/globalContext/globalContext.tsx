import { GridColDef } from "@mui/x-data-grid"
import React, { ReactElement } from "react"

export interface GlobalContextInterface {
    globalContextFilterRows: FilterRow[]
    setGlobalContextFilterRows: React.Dispatch<React.SetStateAction<FilterRow[]>>
    columns: GridColDef[]
    operatorConnector: string
    setOperatorConnector: (data: string) => void
}

interface Props {
    children: ReactElement
}

export const GlobalContextManager = React.createContext({} as GlobalContextInterface)



export const GlobalContextProvider = (props: Props) => {
    const [globalContextFilterRows, setGlobalContextFilterRows] = React.useState<FilterRow[]>([])
    const [operatorConnector, setOperatorConnector] = React.useState<string>("and")

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 300,
            editable: true,
        },
        {
            field: 'dauer',
            headerName: 'Dauer in Minuten',
            type: 'number',
            width: 150,
            editable: true,

        },
        {
            field: 'kosten',
            headerName: 'Grobe Kosten in €',
            type: 'number',
            width: 180,
            editable: true,

        },
        {
            field: 'anleitung',
            headerName: 'Anleitung',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 550,
        },
    ];

    React.useEffect(() => {
        console.log("globalContextFilterRows changed", globalContextFilterRows)
    }, [globalContextFilterRows])

    // function setGlobalContextFilterRows(value: React.SetStateAction<FilterRow[]>) {
    //     console.log("setGlobalContext", value)
    //     _setGlobalContextFilterRows(value)
    // }


    return (
        <GlobalContextManager.Provider
            value={{
                globalContextFilterRows,
                setGlobalContextFilterRows,
                columns,
                operatorConnector,
                setOperatorConnector,
            }}

        >

            {props.children}
        </GlobalContextManager.Provider>
    )
}