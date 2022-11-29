import ClearIcon from '@mui/icons-material/Clear';
import { FormControl, InputLabel, OutlinedInput, Select, SelectChangeEvent, TableCell, TableRow, TextField } from '@mui/material';
import {
    GridColDef
} from '@mui/x-data-grid';
import * as React from 'react';
interface Props {
    columns: GridColDef[]
    filterRow: FilterRow
    index: number,
    key: number,
    updateFilterRow: (filterRow: FilterRow, index: number) => void
    deleteFilterRow: (index: number) => void
}

export default function MultiFilterRow(props: Props) {

    React.useEffect(() => {
        console.log("mount MultifilterRow", props.index);

        return () => { console.log("destroy MultifilterRow", props.index) }
    }, []);


    const operatorsString: string[] = ["contains", "equals", "starts with", "ends with", "is empty", "is not empty", "is any of"];
    const operatorsNumbers: string[] = ["=", "!=", "<", "<=", ">", ">=", "is empty", "is not empty", "is any of"];

    const [selectedColumn, setSelectedColumn] = React.useState<string>(props.filterRow.column);
    const [selectedOperator, setSelectedOperator] = React.useState<string>(props.filterRow.operator);
    const [inputValue, setInputValue] = React.useState<string>(props.filterRow.inputValue);
    const [operators, setOperators] = React.useState<string[]>(operatorsString);
    const [hasChanged, setHasChanged] = React.useState<boolean>(false);


    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setHasChanged(true);
    };
    const handleChangeColumn = (event: SelectChangeEvent) => {
        setSelectedColumn(event.target.value);
        setHasChanged(true);
    };

    const handleChangeOperator = (event: SelectChangeEvent) => {
        setSelectedOperator(event.target.value);
        setHasChanged(true);
    };

    const handleChangeColumnDelete = (value: string) => {
        setSelectedColumn(value);
        setHasChanged(true);
    };

    React.useEffect(() => {
        if (operators.includes(selectedOperator)) return;
        console.log("operator nicht enthalten 🐱‍🏍")
        if (operators === operatorsString) {
            setSelectedOperator("contains")
            console.log("string")
        } else {
            console.log("number")
            setSelectedOperator("=")
        }
    }, [operators]);

    React.useEffect(() => {
        let operatorList: string[] = []
        let operator: string = ""
        for (let i = 0; i < props.columns.length; i++) {
            console.log("checkString", props.columns[i].field, i, selectedColumn)

            if (selectedColumn === props.columns[i].field) {
                if (props.columns[i].type !== 'number') {
                    operatorList = operatorsString
                    break
                } else {
                    operatorList = operatorsNumbers
                    break
                }
            }
        }
        if (!operatorList.includes(selectedOperator)) {
            console.log("CHECK useEffect 🐱‍🏍")
            if (operators === operatorsString) {
                operator = "contains"
                console.log("string")
            } else {
                console.log("number")
                operator = "="
            }
        } else {
            operator = selectedOperator
            console.log("operator enthalten useEffect", { selectedOperator, operator, operatorList })
        }

        if (!hasChanged) {
            if (!props.filterRow.hasChanged) {
                return;
            }
        }
        const filterRow: FilterRow = {
            column: selectedColumn,
            operator: operator,
            inputValue: inputValue,
            hasChanged: true,
        }
        console.log("updateFilterRow in MultiFilterRow aufgerufen + FilterRow", filterRow);
        props.updateFilterRow(filterRow, props.index);

    }, [selectedOperator, selectedColumn, inputValue])

    const deleteFilter = (index: number) => {
        props.deleteFilterRow(index);
        handleChangeColumnDelete(props.filterRow.column);
        console.log("deleteFilter in multiFilterRow aufgerufen mit index", index)
        console.log("params of deleted filterRow", props.filterRow, index)
    };

    const checkStringOrNumber = () => {
        console.log("selectedColumn checkString", selectedColumn)
        for (let i = 0; i < props.columns.length; i++) {
            console.log("checkString", props.columns[i].field, i, selectedColumn)

            if (selectedColumn === props.columns[i].field) {
                if (props.columns[i].type !== 'number') {
                    setOperators(operatorsString);
                    console.log("return String")

                } else {
                    setOperators(operatorsNumbers);
                    console.log("return Number")

                }
            }
        }

    };

    React.useEffect(() => {
        console.log("selectedOperator changed", selectedOperator)
    }, [selectedOperator]);

    React.useEffect(() => {
        checkStringOrNumber();
    }, [selectedColumn]);

    React.useEffect(() => {
        setSelectedColumn(props.filterRow.column)
        setSelectedOperator(props.filterRow.operator)
        setInputValue(props.filterRow.inputValue)
        console.log("props.filterRow änderung", props.filterRow, props.index)
    }, [props.filterRow]);

    return (
        <TableRow>
            <TableCell sx={{ padding: 0, paddingTop: 1.5, paddingBottom: 0.5, borderBottom: 'none' }}>
                <ClearIcon sx={{ marginLeft: 4, size: 'small' }} onClick={() => deleteFilter(props.index)} />
            </TableCell>
            <TableCell sx={{ padding: 0, paddingTop: 1.5, paddingBottom: 0.5, borderBottom: 'none' }}>
                <FormControl variant="standard" sx={{ minWidth: 70 }}>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        native
                        label="Column"
                        onChange={handleChangeColumn}
                        id="column"
                        value={selectedColumn}
                    >
                        {props.columns.map(column =>
                            <option key={column.field} value={column.field}>{column.field}</option>
                        )}
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell sx={{ padding: 0, paddingTop: 1.5, paddingBottom: 0.5, borderBottom: 'none' }}>
                <FormControl variant="standard" sx={{}}>
                    <Select
                        native
                        label="Operator"
                        onChange={handleChangeOperator}
                        value={selectedOperator}
                    >
                        {operators.map(operator =>
                            <option key={operator} value={operator}>{operator}</option>
                        )}
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell sx={{ padding: 0, paddingTop: 1.5, paddingBottom: 0.5, borderBottom: 'none' }}>
                <FormControl variant="standard" sx={{}}>
                    <TextField
                        variant="standard"
                        id="inputValue"
                        value={inputValue}
                        onChange={handleChangeInput}
                        type="text"
                        placeholder='Filter value'
                        inputProps={{
                            'aria-label': 'inputValue',
                        }}
                    />
                </FormControl>
            </TableCell>
        </TableRow >
    )
}