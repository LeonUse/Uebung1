import React, { ReactElement } from "react"

export interface GlobalContextInterface {
    globalContextFilterRows: FilterRow[]
    setGlobalContextFilterRows: (data: FilterRow[]) => void


}

interface Props {
    children: ReactElement
}

export const GlobalContextManager = React.createContext({} as GlobalContextInterface)



export const GlobalContextProvider = (props: Props) => {
    const [globalContextFilterRows, setGlobalContextFilterRows] = React.useState<FilterRow[]>([{
        column: "name",
        operator: "contains",
        inputValue: "",
        hasChanged: false,
    }])


    return (
        <GlobalContextManager.Provider
            value={{
                globalContextFilterRows,
                setGlobalContextFilterRows,
            }}

        >

            {props.children}
        </GlobalContextManager.Provider>
    )
}