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
import { GlobalContextManager, GlobalContextProvider } from '../globalContext/globalContext'


export default function List2() {

    React.useEffect(() => {
        console.log("mount list2");

        return () => { console.log("destroy list2") }
    }, []);

    const { globalContextFilterRows } = React.useContext(GlobalContextManager);
    const [filterRows, setFilterRows] = React.useState<FilterRow[]>(globalContextFilterRows);

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
    const [sortModel, setSortModel] = React.useState([
        {
            field: '',
            sort: '',
        },
    ]);

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


    function filterPanel() {
        return <MyFilterPanel2 columns={columns} />
    }

    const navigate = useNavigate();
    const handleDetail = (list1: rezept) => {
        navigate('/updateItem', { state: { list1 } });
    }

    React.useEffect(() => {
        getDataCount();
        getData(numberItems, start, sortModel, queryOptions);
    }, [page, sortModel, numberItems, queryOptions]);

    React.useEffect(() => {
        console.log("SelectedRows", selectedRowsData);
    }, [selectedRowsData]);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarDensitySelector />
                <GridToolbarFilterButton />
            </GridToolbarContainer>
        );
    }

    const getData = async (numberItems: number, start: number, sortmodel: any, queryOptions: GridFilterItem) => {

        const backendData = {
            numberItems: numberItems,
            start: start,
            field: sortmodel[0].field,
            sort: sortmodel[0].sort,
            // filters: filterRows
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
        getData(numberItems, start, sortModel, queryOptions);

    };

    const onRowsSelectionHandler = (ids: GridSelectionModel) => {
        setSelectedRowsData(ids);
    };

    const handleRowClick = (params: any) => {
        console.log("Row:", params.row);
        handleDetail(params.row);
    };

    const handlePageChange = (params: any) => {
        if (params > page) {
            setStart(start + numberItems);
        } else {
            if (start - numberItems > 0) {
                setStart(start - numberItems);
            } else {
                setStart(0);
            }
        }
        setPage(params);
    };

    const handleSortMode = (params: any) => {
        setSortModel(params);
        console.log("SortMode", params);
    };

    const handlePageSizeChange = (params: any) => {
        setNumberItems(params);
        console.log("Params", params);
        console.log("NumberItems", numberItems);
    };

    const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
        console.log(filterModel);
        setQueryOptions(filterModel.items[0]);
    }, []);


    return (
        <>
            <h1>Page mit Pagination</h1>
            <Box sx={{ width: '100%', marginTop: 10 }}>
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
                <DataGrid
                    rows={list1}
                    columns={columns}
                    autoHeight
                    paginationMode="server"
                    filterMode='server'
                    onPageSizeChange={handlePageSizeChange}
                    rowCount={totalItems}
                    pageSize={numberItems}
                    rowsPerPageOptions={[2, 3, 5]}
                    pagination
                    density='comfortable'
                    onSortModelChange={handleSortMode}
                    onPageChange={handlePageChange}
                    onSelectionModelChange={(ids: GridSelectionModel) => onRowsSelectionHandler(ids)}
                    onRowClick={handleRowClick}
                    disableSelectionOnClick
                    checkboxSelection
                    onFilterModelChange={onFilterChange}
                    components={{
                        Toolbar: CustomToolbar,
                        FilterPanel: filterPanel,
                    }}
                />
            </Box>
        </>
    )
}

