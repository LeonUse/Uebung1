import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridSelectionModel,
    GridColDef,
    GridFilterModel,
    GridFilterItem,
} from '@mui/x-data-grid';
import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import MyFilterPanel2 from '../multiFilter/myFilterPanel';
import { GlobalContextManager, GlobalContextProvider, GlobalContextInterface } from '../globalContext/globalContext'
import Liste2DataGrid from '../dataGrid/liste2DataGrid';
import { json } from 'stream/consumers';


export default function List2() {

    React.useEffect(() => {
        console.log("mount list2");

        return () => { console.log("destroy list2") }
    }, []);
    // const [filterRows, setFilterRows] = React.useState<FilterRow[]>(globalContextFilterRows);

    const { globalContextFilterRows, operatorConnector } = React.useContext(GlobalContextManager);


    React.useEffect(() => {
        console.log("globalContextFilterRows liste2", globalContextFilterRows)
    }, [globalContextFilterRows]);



    const [list1, setList1] = React.useState<rezept[]>([{ id: 0, name: "", dauer: "", kosten: "", anleitung: "" }]);
    const [selectedRowsData, setSelectedRowsData] = React.useState<GridSelectionModel>([]);
    const [page, setPage] = React.useState<number>(0);
    const [numberItems, setNumberItems] = React.useState<number>(5);
    const [start, setStart] = React.useState<number>(0);
    const [totalItems, setTotalItems] = React.useState<number>(0);

    const [queryOptions, setQueryOptions] = React.useState<GridFilterItem>({
        columnField: "",
        operatorValue: "",
        id: 0,
        value: "",
    });

    const [sortModel, setSortModel] = React.useState<SortModel[]>([
        {
            field: '',
            sort: '',
        },
    ]);


    React.useEffect(() => {
        getDataCount();
        getData(numberItems, start, sortModel);
    }, [page, sortModel, numberItems, queryOptions, globalContextFilterRows, operatorConnector]);

    // React.useEffect(() => {
    //     console.log("SelectedRows", selectedRowsData);
    // }, [selectedRowsData]);



    const getData = async (numberItems: number, start: number, sortmodel: any) => {

        const backendData = {
            numberItems: numberItems,
            start: start,
            field: sortmodel[0].field,
            sort: sortmodel[0].sort,
            operatorConnector: operatorConnector,
            filters: globalContextFilterRows,
        };

        console.log("backendData", backendData);
        const response = await fetch("http://localhost:9000/getRezeptePage", { method: 'POST', body: JSON.stringify(backendData) }).then((response) => response.json());
        setList1(response);
    }

    const getDataCount = async () => {
        const response = await fetch("http://localhost:9000/countItems", { method: 'GET' }).then((response) => response.json());
        setTotalItems(response);
    };

    const deleteRezepte = async (id: GridSelectionModel) => {
        const response = await fetch("http://localhost:9000/deleteRezepte?id=" + id, { method: 'DELETE' }).then((response) => response.json());
        getDataCount();
        getData(numberItems, start, sortModel);

    };


    // const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
    //     console.log(filterModel);
    //     setQueryOptions(filterModel.items[0]);
    // }, []);


    return (
        <>
            <h1>Verwalte deine Rezepte!</h1>
            <Box sx={{ width: '100%', marginTop: 5 }}>
                <Grid alignContent="center" container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} marginBottom="20px">
                    <Grid item xs={6}>
                        <Link to="/add" style={{ textDecoration: 'none' }}>
                            <Button variant="contained">Rezept hinzufügen</Button>
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" onClick={(e) => deleteRezepte(selectedRowsData)}>Ausgewählte Rezepte löschen</Button>
                    </Grid>
                </Grid>
                <Liste2DataGrid list1={list1} start={start} totalItems={totalItems} numberItems={numberItems}
                    selectedRowsData={selectedRowsData} sortModel={sortModel} page={page} setNumberItems={setNumberItems} setPage={setPage}
                    setSelectedRowsData={setSelectedRowsData} setSortModel={setSortModel} setStart={setStart}
                />
            </Box>
        </>
    )
}

