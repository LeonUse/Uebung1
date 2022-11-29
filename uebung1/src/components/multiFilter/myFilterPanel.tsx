import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import {
    GridColDef
} from '@mui/x-data-grid';
import * as React from 'react';
import MultiFilterRow from '../multiFilter/multiFilterRow';
import { GlobalContextManager, GlobalContextProvider, GlobalContextInterface } from '../globalContext/globalContext'
import './filter.css'
interface Props {
    columns: GridColDef[]
}

export default function MyFilterPanel2(props: Props) {


    let counter = 0;
    const operatorConnectors: string[] = ["and", "or"]

    const { globalContextFilterRows, setGlobalContextFilterRows, operatorConnector, setOperatorConnector } = React.useContext(GlobalContextManager) as GlobalContextInterface;

    React.useEffect(() => {

        if (globalContextFilterRows.length === 0) {
            console.log("globalContextFilter.length", globalContextFilterRows.length)

            setGlobalContextFilterRows([{
                column: "name",
                operator: "contains",
                inputValue: "",
                hasChanged: false,
            }])
        }

        console.log("mount FilterPanel");
        return () => { console.log("destroy FilterPanel") }
    }, []);


    // React.useEffect(() => {
    //     console.log("FilterRows in FilterPanel hat sich geändert. Neuer Wert:", globalContextFilterRows)
    //     setGlobalContextFilterRows(globalContextFilterRows);
    // }, [globalContextFilterRows]);

    const addFilter = () => {
        const newFilter: FilterRow = {
            column: "name",
            operator: "contains",
            inputValue: "",
            hasChanged: false,
        }
        // setGlobalContextFilterRows((oldRows: FilterRow[]) => oldRows.concat(newFilter))
        setGlobalContextFilterRows((oldRows: FilterRow[]) => [...oldRows, newFilter])
        console.log("new Filter added inside FilterPanel", globalContextFilterRows);
    };

    function updateFilterRow(filterRow: FilterRow, index: number) {
        console.log("Update filterRow in FilterPanel alt", globalContextFilterRows, "index:", index);
        let newArray: FilterRow[] = [...globalContextFilterRows];
        newArray[index] = filterRow;
        setGlobalContextFilterRows(newArray);
        console.log("Update filterRow in FilterPanel neu", newArray, "index:", index);
    }

    function deleteFilterRow(index: number) {
        console.log("delteFilterRow index", index)
        console.log("filterRow before delete", globalContextFilterRows)
        let newArray: FilterRow[] = [...globalContextFilterRows];
        let slicedArray: FilterRow[] = newArray.splice(index, 1)
        console.log("slicedArray", slicedArray)
        console.log("newArray/newFilterRows", newArray)
        setGlobalContextFilterRows(newArray);
    }

    React.useEffect(() => {
        console.log("operatorConnector FilterPanel", operatorConnector)
    }, [operatorConnector]);

    const getSortableColumns = (columns: GridColDef[]) => {
        const sortableColumns: GridColDef[] = [
            {
                field: '',
                headerName: '',
                width: 0,
                editable: true,
            }];

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sortable !== false) {
                sortableColumns.push(columns[i])
            }
        }
        sortableColumns.shift();
        return sortableColumns;
    };

    const handleChange = (event: SelectChangeEvent) => {
        setOperatorConnector(event.target.value as string);
    };

    return (
        <>
            <Table >
                <TableHead sx={{ zIndex: 1000, backgroundColor: 'white' }}>
                    <TableRow >
                        <TableCell sx={{ minWidth: 70, padding: 0, paddingTop: 1 }}>
                            <FormControl variant="standard" sx={{ mx: 3, minWidth: 70 }}>
                                <InputLabel id="demo-simple-select-standard-label">Connector</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    label="Operator"
                                    onChange={handleChange}
                                    value={operatorConnector}
                                >
                                    {operatorConnectors.map(operator =>
                                        <MenuItem key={operator} value={operator}>{operator}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </TableCell>
                        <TableCell sx={{ fontSize: 14, fontWeight: `bold`, padding: 0 }}>Columns</TableCell>
                        <TableCell sx={{ fontSize: 14, fontWeight: `bold`, padding: 0 }}>Operators</TableCell>
                        <TableCell sx={{ fontSize: 14, fontWeight: `bold`, padding: 0 }}>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ fontSize: 14, fontWeight: `bold`, padding: 0, maxHeight: 400 }}>
                    {globalContextFilterRows.map((filterRow) =>
                        <MultiFilterRow deleteFilterRow={deleteFilterRow} key={counter++} updateFilterRow={updateFilterRow} index={counter} filterRow={filterRow} columns={getSortableColumns(props.columns)} />
                    )}
                </TableBody>
            </Table >
            <Button sx={{}} onClick={addFilter}>Add Filter</Button>
        </>


        // <Table>
        //     <TableHead>
        //         <TableRow>
        //             <TableCell> </TableCell>
        //             <TableCell>Columns</TableCell>
        //             <TableCell>Operators</TableCell>
        //             <TableCell>Value</TableCell>
        //         </TableRow>
        //     </TableHead>
        //     <TableBody>
        //         {globalContextFilterRows.map((filterRow) =>
        //             <MultiFilterRow deleteFilterRow={deleteFilterRow} key={counter++} updateFilterRow={updateFilterRow} index={counter} filterRow={filterRow} columns={getSortableColumns(props.columns)} />
        //         )}
        //         <TableRow>
        //             <TableCell>
        //                 <FormControl>
        //                     <InputLabel id="selectedOperator">Operator</InputLabel>
        //                     <Select
        //                         native
        //                         label="Operator"
        //                         onChange={handleChange}
        //                         value={operatorConnector}
        //                     >
        //                         {operatorConnectors.map(operator =>
        //                             <option key={operator} value={operator}>{operator}</option>
        //                         )}
        //                     </Select>
        //                 </FormControl>
        //             </TableCell>
        //             <TableCell>
        //                 <Button onClick={addFilter}>Add Filter</Button>
        //             </TableCell>
        //         </TableRow>
        //     </TableBody>
        // </Table>
    );
}