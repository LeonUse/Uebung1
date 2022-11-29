import {
    DataGrid, GridColDef, GridSelectionModel, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton
} from '@mui/x-data-grid';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import filterPanel2 from '../filterPanel2/filterPanel2';
import { GlobalContextManager } from '../globalContext/globalContext';


interface Props {
    list1: rezept[]
    selectedRowsData: GridSelectionModel
    totalItems: number
    numberItems: number
    sortModel: SortModel[]
    page: number
    start: number
    setSelectedRowsData: (ids: GridSelectionModel) => void
    setStart: (start: number) => void
    setPage: (page: number) => void
    setSortModel: (params: any) => void
    setNumberItems: (params: any) => void
}

export default function Liste2DataGrid(props: Props) {

    const { columns } = React.useContext(GlobalContextManager);

    React.useEffect(() => {
        console.log("mount liste2DataGrid");

        return () => { console.log("destroy liste2DataGrid") }
    }, []);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarDensitySelector />
                <GridToolbarFilterButton />
            </GridToolbarContainer>
        );
    }

    const navigate = useNavigate();
    const handleDetail = (list1: rezept) => {
        navigate('/updateItem', { state: { list1 } });
    }


    const onRowsSelectionHandler = (ids: GridSelectionModel) => {
        props.setSelectedRowsData(ids);
    };

    const handleRowClick = (params: any) => {
        console.log("Row:", params.row);
        handleDetail(params.row);
    };

    const handlePageChange = (params: any) => {
        if (params > props.page) {
            props.setStart(props.start + props.numberItems);
        } else {
            if (props.start - props.numberItems > 0) {
                props.setStart(props.start - props.numberItems);
            } else {
                props.setStart(0);
            }
        }
        props.setPage(params);
    };

    const handleSortMode = (params: any) => {
        props.setSortModel(params);
        console.log("SortMode", params);
    };

    const handlePageSizeChange = (params: any) => {
        props.setNumberItems(params);
        console.log("Params", params);
        console.log("NumberItems", props.numberItems);
    };

    return (
        <DataGrid
            rows={props.list1}
            columns={columns}
            autoHeight
            paginationMode="server"
            filterMode='server'
            onPageSizeChange={handlePageSizeChange}
            rowCount={props.totalItems}
            pageSize={props.numberItems}
            rowsPerPageOptions={[2, 3, 5]}
            pagination
            density='comfortable'
            onSortModelChange={handleSortMode}
            onPageChange={handlePageChange}
            onSelectionModelChange={(ids: GridSelectionModel) => onRowsSelectionHandler(ids)}
            onRowClick={handleRowClick}
            disableSelectionOnClick
            checkboxSelection
            // onFilterModelChange={onFilterChange}
            components={{
                Toolbar: CustomToolbar,
                FilterPanel: filterPanel2
            }}
        />
    )
}