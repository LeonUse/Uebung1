import { DataGrid, GridColDef, GridSelectionModel, GridValueGetterParams } from '@mui/x-data-grid';
import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function List1() {

    const [list1, setList1] = React.useState([]);
    const [selectedRowsData, setSelectedRowsData] = React.useState<GridSelectionModel>([]);
    const [rowID, setRowID] = React.useState(1);


    const navigate = useNavigate();

    const handleDetail = (list1: any, id: number) => {
        navigate('/updateItem', { state: { list1, id } });
    }

    const getList = async () => {
        const response = await fetch("http://localhost:9000/getRezepte", { method: 'GET' }).then((response) => response.json());
        setList1(response);
    };


    React.useEffect(() => {
        getList();
    }, []);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
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

    const deleteRezepte = async (id: GridSelectionModel) => {
        console.log(id);
        const response = await fetch("http://localhost:9000/deleteRezepte?id=" + id, { method: 'DELETE' }).then((response) => response.json());
        getList();
    };

    const onRowsSelectionHandler = (ids: GridSelectionModel) => {
        setSelectedRowsData(ids);
        console.log(ids);
    };

    const handleRowClick = (params: any) => {
        handleDetail(list1, params.id - 1);

    };

    return (
        <>
            <h1>Verwalte hier deine Lieblingsrezepte!</h1>

            <Box sx={{ height: 600, width: '100%', marginTop: 10 }}>
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
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    checkboxSelection
                    onSelectionModelChange={(ids: GridSelectionModel) => onRowsSelectionHandler(ids)}
                    onRowClick={handleRowClick}
                />
            </Box>
        </>
    )
}