/* eslint-disable */
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
import { Container, Grid, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { getComparator, TablePaginationCustom } from 'src/components/table';
import { _addressBooks, _bookings } from 'src/_mock';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSettingsContext } from 'src/components/settings';
import { useVisitorContext } from 'src/context/visitor_context';
import { useAdminMISContext } from 'src/context/admin_mis_context';
import SubDepartmentForm from './sub-department-form';
import EditSubDepartmentForm from './edit-sub-department';
import ShowSubDepartmentDetails from './show-sub-department';
import SearchBar from 'src/components/search/Search-bar';

// ----------------------------------------------------------------------
export default function SubDepartmentRender({
  title,
  subheader,
  tableLabels,
  tableData,
  isApiCalled,
  ...other
}) {
  const defaultFilters = {
    name: '',
  };
  const theme = useTheme();
  const { addVisitorFlag, setAddVisitorFlag } = useVisitorContext();
  const settings = useSettingsContext();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('company');
  const [filters, setFilters] = useState(defaultFilters);

  const onSort = (id) => {
    console.log('on sort called ');
    console.log('id is : ', id);
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });
  const handleFilters = (name, value) => {
    console.log('name' + name, ' ', value);
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const renderSubDepartmentForm = () => {
    return (
      <>
        <SubDepartmentForm />
      </>
    );
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Card {...other}>
      <Grid container justifyContent={'space-between'}>
        <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
       
          <Button
            size="small"
            color="inherit"
            onClick={() => {
              setAddVisitorFlag(true);
            }}
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          >
            Add Sub Department
          </Button>

          <Dialog
            fullWidth
            maxWidth="xl"
            // open={flag.value}
            open={addVisitorFlag}
            onClose={() => {
              setAddVisitorFlag(false);
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
                placeholder="Add Sub Department"
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

            <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderSubDepartmentForm()}</Scrollbar>
          </Dialog>
          <SearchBar
            filters={filters}
            onFilters={handleFilters}
            placeholder="Company, Department or Division"
          />
          </Grid>
        

        <TableContainer sx={{ overflow: 'unset' }}>
        {isApiCalled ? (
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHeadCustom
                headLabel={tableLabels}
                order={order}
                orderBy={orderBy}
                onSort={onSort}
              />

              <TableBody>
                {dataFiltered ? (
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => <SubDepartmentDetailsRow key={row.id} row={row} />)
                ) : (
                  <LinearProgress />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
          ) : (
            <LinearProgress />
          )}
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

SubDepartmentRender.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function SubDepartmentDetailsRow({ row }) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';
  const {
    setItemMasterId,
    editMasterFlag,
    setEditMasterFlag,
    showMasterFlag,
    setShowMasterFlag,
    deleteMasterFlag,
    setDeleteMasterFlag,
  } = useAdminMISContext();

  const popover = usePopover();

  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.id);
  };

  const handleDelete = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/hotel/${row._id}`;
      const res = await axios.delete(URL);
      popover.onClose();
      setDeleteMasterFlag(!deleteMasterFlag);

      alert('deleted successfully');
    } catch (err) {
      alert('not deleted');
      console.log(err);
    }
  };

  const renderEditMaster = () => {
    return (
      <>
        <EditSubDepartmentForm />
      </>
    );
  };

  const renderShowDetails = () => {
    return (
      <>
        <ShowSubDepartmentDetails />
      </>
    );
  };

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
        <TableCell>
          <ListItemText
            primary={row?.gl_code}
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
            setEditMasterFlag(true);
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
            open={editMasterFlag}
            onClose={() => {
              setEditMasterFlag(false);
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
                placeholder="Edit Vendor's details"
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

            <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderEditMaster()}</Scrollbar>
          </Dialog>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setShowMasterFlag(true);
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
            open={showMasterFlag}
            onClose={() => {
              setShowMasterFlag(false);
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
                placeholder="Detail of Vendor"
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

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

      </CustomPopover>
    </>
  );
}

SubDepartmentDetailsRow.propTypes = {
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
