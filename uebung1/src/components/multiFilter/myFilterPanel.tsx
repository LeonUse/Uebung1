import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import {
    GridColDef
} from '@mui/x-data-grid';
import * as React from 'react';
import MultiFilterRow from '../multiFilter/multiFilterRow';
import { GlobalContextManager, GlobalContextProvider } from '../globalContext/globalContext'

interface Props {
    columns: GridColDef[]
}

export default function MyFilterPanel2(props: Props) {

    React.useEffect(() => {
        console.log("mount FilterPanel");

        return () => { console.log("destroy FilterPanel") }
    }, []);

    let counter = 0;

    const { globalContextFilterRows, setGlobalContextFilterRows } = React.useContext(GlobalContextManager);
    const [filterRows, setFilterRows] = React.useState<FilterRow[]>(globalContextFilterRows);

    React.useEffect(() => {
        console.log("FilterRows in FilterPanel hat sich geändert. Neuer Wert:", filterRows)
        // console.log("counter", counter);
        setGlobalContextFilterRows(filterRows);
    }, [filterRows]);

    const addFilter = () => {
        const newFilter: FilterRow = {
            column: "name",
            operator: "contains",
            inputValue: "",
            hasChanged: false,
        }
        setFilterRows((oldRows) => oldRows.concat(newFilter))
        console.log("new Filter added inside FilterPanel", filterRows);
    };

    function updateFilterRow(filterRow: FilterRow, index: number) {
        console.log("Update filterRow in FilterPanel alt", filterRows, "index:", index);
        // filterRows[index] = filterRow;
        // setFilterRows(filterRows);
        let newArray: FilterRow[] = [...filterRows];
        newArray[index] = filterRow;
        setFilterRows(newArray);
        console.log("Update filterRow in FilterPanel neu", newArray, "index:", index);
    }

    function deleteFilterRow(index: number) {
        console.log("delteFilterRow index", index)
        console.log("filterRow before delete", filterRows)
        let newArray: FilterRow[] = [...filterRows];
        let slicedArray: FilterRow[] = newArray.splice(index, 1)
        console.log("slicedArray", slicedArray)
        setFilterRows(newArray);
        console.log("newArray/newFilterRows", newArray)

    }


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

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell> </TableCell>
                    <TableCell>Columns</TableCell>
                    <TableCell>Operators</TableCell>
                    <TableCell>Value</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {filterRows.map((filterRow) =>
                    <MultiFilterRow deleteFilterRow={deleteFilterRow} key={counter++} updateFilterRow={updateFilterRow} index={counter} filterRow={filterRow} columns={getSortableColumns(props.columns)} />
                )}
                <TableRow>
                    <TableCell>
                        <Button onClick={addFilter}>Add Filter</Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}