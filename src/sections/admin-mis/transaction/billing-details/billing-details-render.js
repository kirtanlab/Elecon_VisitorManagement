/* eslint-disable */
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';;
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { dialogClasses } from '@mui/material/Dialog';

import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableHeadCustom from 'src/components/table/table-head-custom';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Container, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { getComparator, TablePaginationCustom } from 'src/components/table';
import { _addressBooks, _bookings } from 'src/_mock';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSettingsContext } from 'src/components/settings';
import { useVisitorContext } from 'src/context/visitor_context';
import BillingDetailsForm from './billing-details-form';
import { Stack } from '@mui/system';
import SearchBar from 'src/components/search/Search-bar';


// ----------------------------------------------------------------------
const defaultFilters = {
    name: '',
};

export default function BillingDetailsRender({ title, subheader, tableLabels, tableData, ...other }) {

    const theme = useTheme();
    const { addVisitorFlag, setAddVisitorFlag } = useVisitorContext();
    const settings = useSettingsContext();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filters, setFilters] = useState(defaultFilters);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("company")

    const onSort = (id) => {
        console.log("on sort called ");
        console.log("id is : ", id);
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    }

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
    });

    const handleFilters = (name, value) => {
        setFilters((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    }


    const renderBillingDetailsForm = () => {

        return (
            <>
                <BillingDetailsForm />
            </>
        )
    }
    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Card {...other}>
                <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
                <Box sx={{ p: 3, textAlign: 'right' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} flexGrow={1} sx={{ width: 1 }}>
                    <SearchBar
                        filters={filters}
                        onFilters={handleFilters}
                    />
                    <Button
                        size="small"
                        color="inherit"
                        onClick={() => { setAddVisitorFlag(true) }}
                        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
                    >
                        Add Billing Details
                    </Button>
                    </Stack>
                    
                    <Dialog
                        fullWidth
                        maxWidth="xl"
                        // open={flag.value}
                        open={addVisitorFlag}
                        onClose={() => { setAddVisitorFlag(false) }}
                        transitionDuration={{
                            enter: theme.transitions.duration.shortest,
                            exit: 0,
                        }}
                        PaperProps={{
                            sx: {
                                mt: 15,
                                overflow: 'unset',
                            },
                        }}
                        sx={{
                            [`& .${dialogClasses.container}`]: {
                                alignItems: 'flex-start',
                            },
                        }}
                    >
                        <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
                            <InputBase
                                fullWidth
                                autoFocus
                                placeholder="Add Billing Details"
                                value={''}
                                onChange={() => {
                                    '';
                                }}

                                endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
                                inputProps={{
                                    sx: { typography: 'h6' },
                                }}
                            />
                        </Box>

                        <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderBillingDetailsForm()}</Scrollbar>
                    </Dialog>
                </Box>

                <TableContainer sx={{ overflow: 'unset' }}>
                    <Scrollbar>
                        <Table sx={{ minWidth: 960 }}>
                            <TableHeadCustom headLabel={tableLabels}
                                order={order}
                                orderBy={orderBy}
                                onSort={onSort}
                            />

                            <TableBody>
                                {dataFiltered ? dataFiltered.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                ).map((row) => (
                                    <BillingDetailsRow key={row.id} row={row} />
                                )) : <LinearProgress />}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <TablePaginationCustom
                    // count={dataFiltered.length}
                    count={dataFiltered.length}
                    // page={table.page}
                    page={page}
                    // rowsPerPage={table.rowsPerPage}
                    rowsPerPage={rowsPerPage}
                    // onPageChange={table.onChangePage}
                    onPageChange={(e, newPage) => {
                        setPage(newPage);
                    }}
                    onRowsPerPageChange={(e) => {
                        setPage(0);
                        setRowsPerPage(parseInt(e.target.value, 10));
                    }}
                //
                // dense={table.dense}
                // onChangeDense={table.onChangeDense}
                />


            </Card>
        </Container>
    );
}

BillingDetailsRender.propTypes = {
    subheader: PropTypes.string,
    tableData: PropTypes.array,
    tableLabels: PropTypes.array,
    title: PropTypes.string,
};


// ----------------------------------------------------------------------

function BillingDetailsRow({ row }) {
    const theme = useTheme();


    const isLight = theme.palette.mode === 'light';



    const popover = usePopover();


    const handlePrint = () => {
        popover.onClose();
        console.info('PRINT', row.id);
    };


    //   const renderShowDetailsVisitor = () => {

    //     return (
    //       <>
    //        <AddressListDialog
    //           />
    //       </>
    //     )
    //   } 

    return (
        <>
            <TableRow>


                <TableCell>
                    <ListItemText
                        primary={row?.company}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                        secondaryTypographyProps={{
                            mt: 0.5,
                            component: 'span',
                            typography: 'caption',
                        }}
                    />
                </TableCell>
                <TableCell>
                    <ListItemText
                        primary={row?.division}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                        secondaryTypographyProps={{
                            mt: 0.5,
                            component: 'span',
                            typography: 'caption',
                        }}
                    />
                </TableCell>
                <TableCell>
                    <ListItemText
                        primary={row?.department}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                        secondaryTypographyProps={{
                            mt: 0.5,
                            component: 'span',
                            typography: 'caption',
                        }}
                    />
                </TableCell>
                <TableCell>
                    <ListItemText
                        primary={row?.sub_department}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                        secondaryTypographyProps={{
                            mt: 0.5,
                            component: 'span',
                            typography: 'caption',
                        }}
                    />
                </TableCell>


                <TableCell align="right" sx={{ pr: 1 }}>
                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>
            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 160 }}
            >

            </CustomPopover>

        </>
    );
}

BillingDetailsRow.propTypes = {
    row: PropTypes.object,
};


function applyFilter({ inputData, comparator }) {
    // const { status, name} = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    return inputData;
}