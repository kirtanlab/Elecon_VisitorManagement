/* eslint-disable */
import { m } from "framer-motion";
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
import ListItemText from "@mui/material/ListItemText";
import TableContainer from "@mui/material/TableContainer";
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
import AddAccView from "./employee-add-acc";
import ShowAccView from "./employee-show-acc";
import AddVisitorView from "./employee-add-visitor";
import EditVisitorView from "./employee-edit-visitor";
import AddressListDialog from "./visitor-show-details";
import { Grid, LinearProgress } from "@mui/material";
import SearchBar from "src/components/search/Search-bar";
import { varHover } from "src/components/animate";
import { useAuthContext } from "src/auth/hooks";
import { alpha } from "@mui/material/styles";
// ----------------------------------------------------------------------
export default function VisitorDetails({
  title,
  subheader,
  tableLabels,
  tableData,
  isApiCalled,
  ...other
}) {
  const defaultFilters = {
    name: "",
  };

  const theme = useTheme();
  const { addVisitorFlag, setAddVisitorFlag } = useVisitorContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [filters, setFilters] = useState(defaultFilters);

  const onSort = (id) => {
    // console.log("on sort called ");
    // console.log("id is : ", id);
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const dataFiltered = tableData
    ? applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filters,
      })
    : {};

  const renderAddVisitor = () => {
    return (
      <>
        <AddVisitorView />
      </>
    );
  };

  const handleFilters = (name, value) => {
    console.log("name" + name, " ", value);

    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Card {...other}>
      <Grid container justifyContent={"space-between"}>
        <CardHeader title={title} subheader={subheader} sx={{ mb: 0 }} />

        <Button
          sx={{ mt: 2.5, mr: 3 }}
          size="small"
          color="inherit"
          onClick={() => {
            setAddVisitorFlag(true);
          }}
          endIcon={
            <Iconify
              icon="eva:arrow-ios-forward-fill"
              width={18}
              sx={{ ml: -0.5 }}
            />
          }
        >
          Add Visitors
        </Button>
        {/* <Simple
          selectedValue={selectedValue}
          open={flag.value}
          onClose={() => {
            setAddVisitorFlag(false);
          }}
        /> */}
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
              mt: 3,
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
            sx={{ p: 1, borderBottom: `solid 1px ${theme.palette.divider}` }}
          >
            <InputBase
              fullWidth
              autoFocus
              placeholder="Add Visitor"
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

          <Scrollbar sx={{ p: 3, pt: 2, height: 700 }}>
            {renderAddVisitor()}
          </Scrollbar>
        </Dialog>

        <SearchBar
          filters={filters}
          onFilters={handleFilters}
          placeholder="Visitor Name or Email"
        />
      </Grid>

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
                      <VisitorDetailsRow key={row.id} row={row} />
                    ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <Divider sx={{ borderStyle: "dashed" }} />

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(e, newPage) => {
              setPage(newPage);
            }}
            onRowsPerPageChange={(e) => {
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

VisitorDetails.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function VisitorDetailsRow({ row }) {
  // console.log("row",row)
  const theme = useTheme();

  const { deleteVisitorToggle, editVisitorFlag, setEditVisitorFlag } =
    useVisitorContext();
  const isLight = theme.palette.mode === "light";

  const [currentUser, setCurrentUser] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  console.log("image", row.image);
  const popover = usePopover();
  // const flag = useBoolean(false);
  const {
    editFlag,
    addAccFlag,
    setAddAccFlag,
    showAccFlag,
    setShowAccFlag,
    setVisitorId,
    visitorId,
    showDetailsVisitorFlag,
    setShowDetailsVisitorFlag,
  } = useVisitorContext();
  // const [flag, setFlag] = useState(false);

  const handlePrint = () => {
    popover.onClose();
    console.info("PRINT", row.id);
  };

  const handleDelete = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/visitor/${row._id}/deleteVisitor`;
      const visitor = await axios.delete(URL);
      popover.onClose();
      deleteVisitorToggle();
      alert("deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const renderAddAcc = () => {
    return (
      <>
        <AddAccView />
      </>
    );
  };

  const renderShowAcc = () => {
    return (
      <>
        <ShowAccView />
      </>
    );
  };

  const renderEditVisitor = () => {
    return (
      <>
        <EditVisitorView currentUser={currentUser} />
      </>
    );
  };
  const renderShowDetailsVisitor = () => {
    return (
      <>
        <AddressListDialog />
      </>
    );
  };
  const { user } = useAuthContext();
  console.log("user in account", user);
  return (
    <>
      <TableRow>
        <TableCell>
          {/* <ListItemText
            primary={row.image}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          /> */}
          <IconButton
            component={m.button}
            whileTap="tap"
            whileHover="hover"
            variants={varHover(1.05)}
            onClick={() => {
              setOpenImage(true);
            }}
            sx={{
              width: 40,
              height: 40,
              background: (theme) => alpha(theme.palette.grey[500], 0.08),
              ...(popover.open && {
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
              }),
            }}
          >
            <Avatar
              src={user?.photoURL}
              alt={user?.emp_name}
              sx={{
                width: 36,
                height: 36,
                border: (theme) =>
                  `solid 2px ${theme.palette.background.default}`,
              }}
            />
          </IconButton>
          <Dialog
            // fullWidth
            maxWidth="xl"
            // open={flag.value}
            open={openImage}
            isFullscreen={true}
            onClose={() => {
              setOpenImage(false);
            }}
            transitionDuration={{
              enter: theme.transitions.duration.shortest,
              exit: 0,
            }}
            PaperProps={{
              sx: {
                mt: 3,
                padding: 1,
                // paddingTop: 6,
                // paddingTop: 1,
                // position: "fixed",

                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // overflow: "unset",
              },
            }}
            sx={{
              [`& .${dialogClasses.container}`]: {
                alignItems: "flex-start",
              },
            }}
          >
            <Box
              component="img"
              sx={{
                width: "40%",
                height: "80%",
                borderRadius: 20,
              }}
              src={require("../../../../assets/images/dummy.jpeg")}
              alt={row?.name ? row?.name : "visitor"}
            />
          </Dialog>
        </TableCell>
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
        sx={{ width: 200 }}
      >
        {row.in_time ? (
          <MenuItem
            disabled
            onClick={() => {
              setEditVisitorFlagGateUser(true);
              setVisitorId(row._id);
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="eva:cloud-download-fill" />
            Edit
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setEditVisitorFlagGateUser(true);
              setVisitorId(row._id);
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="eva:cloud-download-fill" />
            Edit
          </MenuItem>
        )}

        <Dialog
          fullWidth
          maxWidth="xl"
          // open={flag.value}
          open={editVisitorFlag}
          onClose={() => {
            setEditVisitorFlag(false);
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
              placeholder="Edit here"
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
            {renderEditVisitor()}
          </Scrollbar>
        </Dialog>

        <MenuItem
          onClick={() => {
            setShowDetailsVisitorFlag(true);
            setVisitorId(row._id);
          }}
          sx={{ color: "warning.main" }}
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
          sx={{ color: "secondary.main" }}
        >
          <Iconify icon="solar:share-bold" />
          Show Accessories
        </MenuItem>

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

        {row.in_time ? (
          <MenuItem
            disabled
            onClick={() => {
              setAddAccFlag(true);
              setVisitorId(row._id);
            }}
            sx={{ color: "primary.main" }}
          >
            <Iconify icon="basil:add-solid" />
            Add Accessories
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setAddAccFlag(true);
              setVisitorId(row._id);
            }}
            sx={{ color: "primary.main" }}
          >
            <Iconify icon="basil:add-solid" />
            Add Accessories
          </MenuItem>
        )}

        <Dialog
          fullWidth
          maxWidth="md"
          // open={flag.value}
          open={addAccFlag}
          onClose={() => {
            setAddAccFlag(false);
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
              placeholder="Add Accessory"
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
            {renderAddAcc()}
          </Scrollbar>
        </Dialog>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

VisitorDetailsRow.propTypes = {
  row: PropTypes.object,
};

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // console.log('inputData' , inputData)
  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.email_id.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
