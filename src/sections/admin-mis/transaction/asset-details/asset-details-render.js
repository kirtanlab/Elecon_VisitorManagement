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
import { Stack } from '@mui/system';
import AssetDetailsForm from './asset-details-form';
import PaymentDetailsForm from '../payment-details-form';
import SearchBar from 'src/components/search/Search-bar';
import { useAdminMISContext } from 'src/context/admin_mis_context';
import EditAssetDetailsForm from './edit-asset-detail-form';
import ShowAssetBillDetails from './show-asset-bill-details';

// ----------------------------------------------------------------------
const defaultFilters = {
    name: '',
};

export default function AssetDetailsRender({ title, subheader, tableLabels, tableData, ...other }) {

    const theme = useTheme();
    const settings = useSettingsContext();
    const [page, setPage] = useState(0);
    const [payment, setPayment] = useState();
    const [asset, setAsset] = useState();
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
        filters
    });

    const handleFilters = (name, value) => {
        setFilters((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    


    const renderAssetDetailsForm = () => {

        return (
            <>
                <AssetDetailsForm />
            </>
        )
    }

    // const renderPaymentDetailsForm = () => {

    //     return (
    //         <>
    //             <PaymentDetailsForm />
    //         </>
    //     )
    // }

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Card {...other}>
                <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
                <Box sx={{ p: 3, textAlign: 'right' }}>
                        <SearchBar
                            filters={filters}
                            onFilters={handleFilters}
                            placeholder='Asset Name, company, division, department '
                        />
                    <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1} flexGrow={1} sx={{ width: 1 }}>
                        <Button
                            size="small"
                            color="inherit"
                            onClick={() => { setAsset(true) }}
                            endIcon={<Iconify icon="clarity:form-line"  width={18} sx={{ ml: -0.5 }} />}
                        >
                            Add Asset Details
                        </Button>
                        {/* <Button
                            size="small"
                            color="inherit"
                            onClick={() => { setPayment(true) }}

                            endIcon={<Iconify icon="clarity:form-line"  width={18} sx={{ ml: -0.5 }} />}
                        >
                            Add Payment Details
                        </Button> */}
                    </Stack>

                    <Dialog
                        fullWidth
                        maxWidth="xl"
                        // open={flag.value}
                        open={asset}
                        onClose={() => { setAsset(false) }}
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
                                placeholder="Add Asset Details"
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

                        <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderAssetDetailsForm()}</Scrollbar>
                    </Dialog>

                    {/* <Dialog
                        fullWidth
                        maxWidth="xl"
                        // open={flag.value}
                        open={payment}
                        onClose={() => { setPayment(false) }}
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
                                placeholder="Add Payment Details"
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

                        <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderPaymentDetailsForm()}</Scrollbar>
                    </Dialog> */}
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
                                    <AssetDetailsRow key={row.id} row={row} />
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

AssetDetailsRender.propTypes = {
    subheader: PropTypes.string,
    tableData: PropTypes.array,
    tableLabels: PropTypes.array,
    title: PropTypes.string,
};


// ----------------------------------------------------------------------

function AssetDetailsRow({ row }) {
    const theme = useTheme();

    const {toggleAddDepartmentFlag, setItemMasterId, editTransactionFlag, showTransactionFlag, deleteTransactionFlag, setEditTransactionFlag, setShowTransactionFlag, setDeleteTransactionFlag} = useAdminMISContext();


    const isLight = theme.palette.mode === 'light';



    const popover = usePopover();


    const handlePrint = () => {
        popover.onClose();
        console.info('PRINT', row.id);
    };


    const renderEdit = () => {
        return (
            <>
              <EditAssetDetailsForm />
            </>
        );
    }

    const renderShowDetails = () => {
        return (
            <>
              <ShowAssetBillDetails />
            </>
        );
    }
    

    const handleDelete = async(gotId) => {
        try{
            const URL = `http://localhost:5000/api/v1/bill/asset/${gotId}`
            const res = await axios.delete(URL)
            toggleAddDepartmentFlag()
            alert("Delete Successfully");
        }
        catch(err){
            alert("something went wrong in delete hotel bill")
            console.log(err);

        }
    }

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
                        primary={row?.item}
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
                        primary={row?.issued_to}
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
                        primary={row?.approved_by}
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
                <MenuItem
          onClick={() => {
            setEditTransactionFlag(true);
            setItemMasterId(row._id);
          }}
          sx={{ color: '#E29926' }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
          <Dialog
            fullWidth
            maxWidth="lg"
            // open={flag.value}
            open={editTransactionFlag}
            onClose={() => {
              setEditTransactionFlag(false);
            }}
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
                placeholder="Edit Hotel Bill details"
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

            <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderEdit()}</Scrollbar>
          </Dialog>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setShowTransactionFlag(true);
            setItemMasterId(row._id);
          }}
          sx={{ color: '#5865F2' }}
        >
          <Iconify icon="eva:file-fill" />
          Show Details
          <Dialog
            fullWidth
            maxWidth="sm"
            // open={flag.value}
            open={showTransactionFlag}
            onClose={() => {
              setShowTransactionFlag(false);
            }}
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
                placeholder="Detail of Asset Bills"
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

            <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderShowDetails()}</Scrollbar>
          </Dialog>
        </MenuItem>

        <MenuItem onClick={() => {handleDelete(row._id)}} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
            </CustomPopover>

        </>
    );
}

AssetDetailsRow.propTypes = {
    row: PropTypes.object,
};


function applyFilter({ inputData, comparator, filters}) {
    const { name} = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
          (order) => 
            order.company.toLowerCase().indexOf(name.toLowerCase()) !== -1 || 
            order.division.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
            order.department.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
            order.item.toLowerCase().indexOf(name.toLowerCase()) !== -1 || 
            order.issued_to.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||  
            order.approved_by.toLowerCase().indexOf(name.toLowerCase()) !== -1 
        );
      }

    return inputData;
}