import ClearIcon from '@mui/icons-material/Clear';
import { FormControl, InputLabel, OutlinedInput, Select, SelectChangeEvent, TableCell, TableRow } from '@mui/material';
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

    React.useEffect(() => {
        console.log("props haben sich verändert", props)

    }, [props]);

    const operatorsString: string[] = ["contains", "equals", "starts with", "ends with", "is empty", "is not empty", "is any of"];
    const operatorsNumbers: string[] = ["=", "!=", "<", "<=", ">", ">=", "is empty", "is not empty", "is any of"];

    const [selectedColumn, setSelectedColumn] = React.useState<string>(props.filterRow.column);
    const [selectedOperator, setSelectedOperator] = React.useState<string>(props.filterRow.operator);
    const [inputValue, setInputValue] = React.useState<string>(props.filterRow.inputValue);
    const [operators, setOperators] = React.useState<string[]>(operatorsString);
    const [hasChanged, setHasChanged] = React.useState<boolean>(false);


    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
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
        if (!hasChanged) {
            if (!props.filterRow.hasChanged) {
                return;
            }
        }
        const filterRow: FilterRow = {
            column: selectedColumn,
            operator: selectedOperator,
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
        // console.log("params of deleted filterRow", props.filterRow, index)

    };

    const checkStringOrNumber = () => {
        for (let i = 0; i < props.columns.length; i++) {
            if (selectedColumn === props.columns[i].field) {
                if (props.columns[i].type !== 'number') {
                    setOperators(operatorsString);
                } else {
                    setOperators(operatorsNumbers);
                }
            }
        }
    };

    React.useEffect(() => {
        console.log("useEffect Operators 😎")
        if (operators.includes(selectedOperator)) return;
        console.log("Operator war nicht in der Liste 😎")
        if (operators === operatorsString) {
            setSelectedOperator("contains")
        } else {
            setSelectedOperator("=")
        }

    }, [operators]);

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
            <TableCell>
                <ClearIcon onClick={() => deleteFilter(props.index)} />
            </TableCell>
            <TableCell>
                <FormControl>
                    <InputLabel id="selectedColumn">Column</InputLabel>
                    <Select
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
            <TableCell>
                <FormControl>
                    <InputLabel id="selectedOperator">Operator</InputLabel>
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
            <TableCell>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <OutlinedInput
                        id="inputValue"

                        value={inputValue}
                        onChange={handleChangeInput}
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                            'aria-label': 'inputValue',
                        }}
                    />
                </FormControl>
            </TableCell>
        </TableRow >
    )
}