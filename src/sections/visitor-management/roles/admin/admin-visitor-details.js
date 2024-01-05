/* eslint-disable */
import PropTypes from "prop-types";
import { format } from "date-fns";
import axios from "axios";
// @mui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog, { dialogClasses } from "@mui/material/Dialog";

import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import { Grid, LinearProgress, Stack } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import TableContainer from "@mui/material/TableContainer";
import { jsPDF } from "jspdf";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import TableHeadCustom from "src/components/table/table-head-custom";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { useEffect, useState } from "react";
import { _addressBooks, _bookings } from "src/_mock";
import { useBoolean } from "src/hooks/use-boolean";
import { TablePaginationCustom, getComparator } from "src/components/table";
import { useVisitorContext } from "src/context/visitor_context";

import AddressListDialog from "../employee/visitor-show-details";
import ShowAccView from "../employee/employee-show-acc";
import SearchBar from "src/components/search/Search-bar";

const defaultFilters = {
  name: "",
};
// ----------------------------------------------------------------------
export default function AdminVisitorDetails({
  title,
  subheader,
  tableLabels,
  tableData,
  isApiCalled,
  ...other
}) {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filters, setFilters] = useState(defaultFilters);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const onSort = (id) => {
    console.log("on sort called ");
    console.log("id is : ", id);
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filters,
  });

  const { adminVisitorDate } = useVisitorContext();

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  const formatTimeAndDate = (d) => {
    var now = new Date(d);
    var date = now.toLocaleDateString();
    var time = now.toLocaleTimeString();
    return `${date}  ${time}`;
  };

  const handleFilters = (name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePrint = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [500, 500],
    });

    const gotDate = adminVisitorDate.format("YYYY-MM-DD");
    const tempHeaders = [
      "Name",
      "Mobile",
      "Email",
      "Gender",
      "Is Professinal",
      "Entry Gate",
      "Purpose",
      "To Whom",
      "Visit Type",
      "Guest Company",
      "Designation",
      "Appointment Half",
      "To Date",
      "From Date",
      "In Time",
      "Out Time",
    ];
    // const tempHeaders = ["Name", "Mobile", "Email", "Gender"];
    const headers = tempHeaders.map((header) => {
      return {
        id: header,
        name: header,
        prompt: header,
      };
    });
    const URL = `http://localhost:5000/api/v1/visitor/byDate`;
    const res = await axios.post(URL, {
      date: gotDate,
    });

    const tabled = res?.data?.data.map((visitor) => {
      return {
        Name: visitor.name,
        Mobile: visitor.phone_no,
        Email: visitor.email_id,
        Gender: visitor.gender,
        "Is Professinal": visitor?.is_professional ? "YES" : "NO",
        "Entry Gate": visitor?.entry_gate,
        Purpose: visitor?.purpose,
        "To Whom": visitor?.to_whom_id?.emp_name,
        "Visit Type": visitor?.visit_type === "" ? "---" : visitor?.visit_type,
        "Guest Company":
          visitor?.guest_company === "" ? "---" : visitor?.guest_company,
        Designation: visitor?.designation === "" ? "---" : visitor?.designation,
        "Appointment Half":
          visitor?.appointment_half === "" ? "---" : visitor?.appointment_half,
        "To Date": formatDate(visitor?.to_date),
        "From Date": formatDate(visitor?.from_date),
        "In Time":
          visitor?.in_time === null
            ? "remaining"
            : formatTimeAndDate(visitor?.in_time),
        "Out Time":
          visitor?.out_time === null
            ? "remaining"
            : formatTimeAndDate(visitor?.out_time),
      };
    });

    doc.table(1, 1, tabled, headers, { autoSize: true });

    doc.save(`${gotDate}-visitors.pdf`);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 0 }} />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        flexGrow={1}
        sx={{ width: 1 }}
      >
        <SearchBar
          filters={filters}
          onFilters={handleFilters}
          placeholder="Name"
        />
        <Button
          sx={{ mr: 2 }}
          size="medium"
          color="inherit"
          onClick={handlePrint}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} />}
        >
          Print Visitors
        </Button>
      </Stack>

      {isApiCalled ? (
        <Grid>
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={tableLabels}
                  order={order}
                  orderBy={orderBy}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <AdminVisitorDetailsRow key={row.id} row={row} />
                    ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <Divider sx={{ borderStyle: "dashed" }} />

          <TablePaginationCustom
            // count={dataFiltered.length}
            count={tableData.length}
            // page={table.page}
            page={page}
            // rowsPerPage={table.rowsPerPage}
            rowsPerPage={rowsPerPage}
            // onPageChange={table.onChangePage}
            onPageChange={(e, newPage) => {
              // console.log("here in page change")
              setPage(newPage);
            }}
            onRowsPerPageChange={(e) => {
              console.log("here in rows per page change");
              setPage(0);
              setRowsPerPage(parseInt(e.target.value, 10));
            }}
          />
        </Grid>
      ) : (
        <div>
          <LinearProgress />
        </div>
      )}
    </Card>
  );
}

AdminVisitorDetails.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function AdminVisitorDetailsRow({ row }) {
  const theme = useTheme();

  const isLight = theme.palette.mode === "light";

  const popover = usePopover();

  const {
    showAccFlag,
    setShowAccFlag,
    setVisitorId,
    visitorId,
    showDetailsVisitorFlag,
    setShowDetailsVisitorFlag,
  } = useVisitorContext();

  const renderShowAcc = () => {
    return (
      <>
        <ShowAccView />
      </>
    );
  };

  const renderShowDetailsVisitor = () => {
    return (
      <>
        {/* <AddressListDialog/> */}
        <AddressListDialog />
      </>
    );
  };

  return (
    <>
      <TableRow sx={{}}>
        <TableCell>
          <ListItemText
            primary={row.name}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.phone_no}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.gender}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.is_professional ? "YES" : "NO"}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.visit_type ? row.visit_type : "-----"}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.place ? row.place : "-----"}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.appointment_half}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.entry_gate}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={row.purpose}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={popover.onOpen}
          >
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
            setShowDetailsVisitorFlag(true);
            setVisitorId(row._id);
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Show Details
        </MenuItem>

        <Dialog
          fullWidth
          maxWidth="sm"
          // open={flag.value}
          open={showDetailsVisitorFlag}
          onClose={() => {
            setShowDetailsVisitorFlag(false);
          }}
          transitionDuration={{
            enter: theme.transitions.duration.shortest,
            exit: 0,
          }}
          PaperProps={{
            sx: {
              mt: 15,
              overflow: "unset",
            },
          }}
          sx={{
            [`& .${dialogClasses.container}`]: {
              alignItems: "flex-start",
            },
          }}
        >
          <Box
            sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}
          >
            <InputBase
              fullWidth
              autoFocus
              placeholder="Visitor Details"
              value={""}
              onChange={() => {
                ("");
              }}
              endAdornment={
                <Label sx={{ letterSpacing: 1, color: "text.secondary" }}>
                  esc
                </Label>
              }
              inputProps={{
                sx: { typography: "h6" },
              }}
            />
          </Box>

          <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>
            {renderShowDetailsVisitor()}
          </Scrollbar>
        </Dialog>

        <MenuItem
          onClick={() => {
            setShowAccFlag(true);
            setVisitorId(row._id);
          }}
        >
          {/* <Iconify icon="solar:share-bold" /> */}
          Show Accessories
          <Dialog
            fullWidth
            maxWidth="lg"
            open={showAccFlag}
            onClose={() => {
              setShowAccFlag(false);
            }}
            transitionDuration={{
              enter: theme.transitions.duration.shortest,
              exit: 0,
            }}
            PaperProps={{
              sx: {
                mt: 15,
                overflow: "unset",
              },
            }}
            sx={{
              [`& .${dialogClasses.container}`]: {
                alignItems: "flex-start",
              },
            }}
          >
            <Box
              sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}
            >
              <InputBase
                fullWidth
                autoFocus
                placeholder="Accessories"
                value={""}
                onChange={() => {
                  ("");
                }}
                endAdornment={
                  <Label sx={{ letterSpacing: 1, color: "text.secondary" }}>
                    esc
                  </Label>
                }
                inputProps={{
                  sx: { typography: "h6" },
                }}
              />
            </Box>

            <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>
              {renderShowAcc()}
            </Scrollbar>
          </Dialog>
        </MenuItem>
      </CustomPopover>
    </>
  );
}

AdminVisitorDetailsRow.propTypes = {
  row: PropTypes.object,
};

function applyFilter({ inputData, filters, comparator }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    // console.log(name, "name")
    inputData = inputData.filter(
      (order) =>
        order.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        // order.gender.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.entry_gate.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  // console.log("in filter : ", inputData);
  return inputData;
}
