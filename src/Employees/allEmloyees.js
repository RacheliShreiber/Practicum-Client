import { useState } from 'react';
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import { Box, Button, IconButton, Avatar, Tooltip } from '@mui/material';
import { DialogTitle } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from '@mui/material';
import AddOrUpdateEmployee from './addOrUpdateEmployee';
import store from '../store/employee'

const AllEmployees = observer(() => {
    const dataList = store.dataEmployees;
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateEmployeeId, setUpdateEmployeeId] = useState(null);
    const [isAdd, setIsAdd] = useState(false);
    const [isHover, setIsHover] = useState(false)
    function handleDelete(id) {
        console.log('Delete item with id:', id);
        store.deleteEmployee(id);
    };
    function handleUpdate(id) {
        console.log('Update item with id:', id);
        setUpdateEmployeeId(id);
        setIsUpdate(true);
    };
    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor('firstName', {
            header: 'First Name',
            size: 120,
        }),
        columnHelper.accessor('lastName', {
            header: 'Last Name',
            size: 120,
        }),
        columnHelper.accessor('identity', {
            header: 'Identity',
            size: 300,
        }),
        columnHelper.accessor('startWork', {
            header: 'Start of Work',
        }),
        {
            header: 'Delete',
            accessor: 'id',
            Cell: ({ row }) => (
                <IconButton onClick={() => handleDelete(row.original.id)}>
                    <DeleteIcon />
                </IconButton>
            )
        },
        {
            header: 'Update',
            accessor: 'id',
            Cell: ({ row }) => (
                <IconButton onClick={() => handleUpdate(row.original.id)}>
                    <EditIcon />
                </IconButton>
            )
        }
    ];
    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });
    function handleExportExcel(rows) {
        const rowData = rows.map((row) => {
            const employeeRolesString = JSON.stringify(row.original.employeeRoles);
            return {
                ...row.original,
                employeeRoles: employeeRolesString,
            };
        });
        const csv = generateCsv(csvConfig)(rowData);
        const filename = 'employees_data.csv';
        download({ ...csvConfig, filename })(csv);
        //  download(csvConfig)(csv);
    };
    const table = useMaterialReactTable({
        columns,
        data: dataList,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    onClick={() =>
                        handleExportExcel(table.getPrePaginationRowModel().rows)
                    }
                    startIcon={<FileDownloadIcon />}
                >
                    Export To Excel
                </Button>
            </Box>
        ),
    })
    return (
        <>
            <DialogTitle sx={{ marginLeft: "35vw" }}>
                <Typography sx={{ fontSize: "30px" }}>Employee List Management</Typography>
            </DialogTitle>
            <Tooltip
                title={isHover ? 'ADD EMPLOYEE' : ''}>
                <IconButton
                    onClick={() => setIsAdd(true)} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}
                    sx={{ marginTop: "30px", marginBottom: "30px", marginLeft: "50vw" }}>
                    <Avatar sx={{ backgroundColor: "red" }}>
                        <AddIcon ></AddIcon>
                    </Avatar>
                </IconButton>
            </Tooltip>
            {isAdd && <AddOrUpdateEmployee flagCloseForm={setIsAdd} EmployeeId={null}></AddOrUpdateEmployee>}
            {isUpdate && <AddOrUpdateEmployee flagCloseForm={setIsUpdate} EmployeeId={updateEmployeeId}></AddOrUpdateEmployee>}
            <MaterialReactTable table={table} />
            <Link to="/roles" style={{ textDecoration: 'none' }}>
                <Button startIcon={<ArrowBackIcon />} variant="contained"
                    sx={{ marginTop: "30px", marginBottom: "30px", marginLeft: "50vw", backgroundColor: "red" }}
                >
                    Roles
                </Button>
            </Link>
        </>
    )
})
export default AllEmployees;