/* eslint-disable */

import { useTheme } from "@emotion/react";
import { Box, Button, Card, CardHeader, Dialog, Divider, IconButton, InputBase, ListItemText, MenuItem, Table, TableBody, TableCell, TableContainer, TableRow, dialogClasses } from "@mui/material";
import axios from "axios";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { usePopover } from "src/components/custom-popover";
import CustomPopover from "src/components/custom-popover/custom-popover";
import Iconify from "src/components/iconify/iconify";
import Label from "src/components/label/label";
import Scrollbar from "src/components/scrollbar/scrollbar";
import { TableHeadCustom, TablePaginationCustom, getComparator } from "src/components/table";
import { useVisitorContext } from "src/context/visitor_context";

import EditVisitorView from "../employee/employee-edit-visitor";
import ShowAccView from "../employee/employee-show-acc";
import AddAccView from "../employee/employee-add-acc";
import AddressListDialog from "../employee/visitor-show-details";
import { InDialog } from "./inDialog";
import { useBoolean } from "src/hooks/use-boolean";
import { OutDialog } from "./outDialog";

export default function VisitorDetailsGateUser({ title, subheader, tableLabels, tableData, ...other }) {

    const theme = useTheme();
    const {addVisitorFlag, setAddVisitorFlag} = useVisitorContext();

    const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

    const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name")

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
  
  
    return (
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
  
        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHeadCustom headLabel={tableLabels} 
              order={order}
              orderBy={orderBy}
              onSort={onSort}
              />
  
              <TableBody>
                {dataFiltered.slice(page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage).map((row) => (
                  <VisitorDetailsRow key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
  
        <Divider sx={{ borderStyle: 'dashed' }} />
  
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
      </Card>
    );
  }
  
  VisitorDetailsGateUser.propTypes = {
    subheader: PropTypes.string,
    tableData: PropTypes.array,
    tableLabels: PropTypes.array,
    title: PropTypes.string,
  };

//   <Button
//   size="small"
//   color="inherit"
//   onClick={() => {setAddVisitorFlag(true)}}
//   endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
// >
//   Add Visitors
// </Button>

// ----------------------------------------------------------------------

function VisitorDetailsRow({ row }) {

    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';

    const [currentUser, setCurrentUser] = useState(null);
    const [nameOfEmp,setNameOfEmp] = useState('');

    const getNameOfEmp = async() => {
      const res = await axios.get(`http://localhost:5000/api/v1/employee/${row.to_whom_id}`);
      // console.log('********API*********',res?.data?.data?.emp_name)
      const name = res?.data?.data?.emp_name;
      setNameOfEmp(name);
    }

    useEffect(() => {
      getNameOfEmp();
    } , [])
    
    const popover = usePopover();
    const {addAccFlagGateUser, setAddAccFlagGateUser, setAddAccFlag, showAccFlagGateUser,setShowAccFlagGateUser, editVisitorFlagGateUser, 
      setEditVisitorFlagGateUser,setVisitorId, visitorId,outGateUser ,setOutGateUser,inGateUser, setInGateUser,deleteVisitorToggle, showDetailsVisitorFlag, setShowDetailsVisitorFlag} = useVisitorContext();
 
    const confirmIn = useBoolean();

    const confirmOut = useBoolean();
    
    // const visitorIn = async() => {
    //   try{
    //     const res = await axios.post(`http://localhost:5000/api/v1/visitor/${row._id}/inTime`)
    //     console.log('visitor is in api call',res)

    //     await axios.post(`http://localhost:5000/api/v1/notification`, {
    //       title: `Notification for Visitor Management`,
    //       message: `${row.name} is entered into the company`,
    //       sender_id: sessionStorage.getItem("id"),
    //       receiver_id: row.to_whom_id

    //     })
    //     setInGateUser();
    //     alert(`${row.name} has entered and notification has been sent to employee`)

    //   }
    //   catch(err){
    //     alert("something went wrong");
    //     console.log(err);
    //   }
        
    // }

    // const visitorOut = async() => {
      
    //   try{
    //     const res = await axios.post(`http://localhost:5000/api/v1/visitor/${row._id}/outTime`)
    //     console.log('visitor is out api call',res)

    //     await axios.post(`http://localhost:5000/api/v1/notification`, {
    //       title: `Notification for Visitor Management`,
    //       message: `${row.name} has exited`,
    //       sender_id: sessionStorage.getItem("id"),
    //       receiver_id: row.to_whom_id

    //     })
    //     setOutGateUser();
    //     alert(`${row.name} has exited and notification has been sent to the employee`)
    //   }
    //   catch(err){
    //     alert("something went wrong");
    //     console.log(err);
    //   }

    // }

    const formatTimeAndDate = (d) => {
      const now = new Date(d)
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      return `${date} | ${time}`
    }

    // const handleDelete = async() => {
    //   try{
    //     const URL = `http://localhost:5000/api/v1/visitor/${row._id}/deleteVisitor`
    //     const visitor = await axios.delete(URL);
    //     popover.onClose();
    //     deleteVisitorToggle();
    //     alert("deleted successfully")
    //   }
    //   catch(err){
    //     alert("something went wrong");
    //     console.log(err);
    //   }
    // };
  
    const renderAddAcc = () => {
  
      return (
        <>
          <AddAccView/>
        </>
      )
    }
  
    const renderShowAcc = () => {
      return (
        <>
          <ShowAccView/>
        </>
      )
    }
  
    const renderEditVisitor = () => {
      
      return (
        <>
          <EditVisitorView currentUser={currentUser}/>
        </>
      )
    } 


    const renderShowDetailsVisitor = () => {
      return (
        <>
          <AddressListDialog/>
        </>
      )
    }

    return (
      <>
        <TableRow>
          
          <TableCell>
            <ListItemText
              primary={row.name}
              // secondary={row.customer.phoneNumber}
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
              primary={row.phone_no}
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
              primary={row.gender}
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
              primary={nameOfEmp}
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
              primary={row.is_professional ? 'YES' : 'NO'}
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
              primary={row.place?row.place:'-----'}
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
              primary={row.appointment_half}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
              }}
            />
          </TableCell>

          <TableCell>
            {row.in_time == null ? 
              (<Button  variant="contained" color="primary" size="small" onClick={confirmIn.onTrue}> 
                  IN
              </Button>):
              
              (<ListItemText
                primary={formatTimeAndDate(row.in_time)}
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                secondaryTypographyProps={{
                  mt: 0.5,
                  component: 'span',
                  typography: 'caption',
                }}
              />
            )}
          </TableCell>

          <TableCell>
          {row.out_time == null ? 
              (row.in_time ? 
                <Button variant="contained" color="error" size="small" onClick={confirmOut.onTrue}> 
                    OUT
                </Button> : 
                <Button disabled variant="contained" color="error" size="small" onClick={confirmOut.onTrue}> 
                    OUT
                </Button>
              ):
              (<ListItemText
                primary={formatTimeAndDate(row.out_time)}
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                secondaryTypographyProps={{
                  mt: 0.5,
                  component: 'span',
                  typography: 'caption',
                }}
              />
            )}
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
          
          {row.in_time ?
            (
            <MenuItem disabled onClick={() => {setEditVisitorFlagGateUser(true);setVisitorId(row._id);}} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:cloud-download-fill" />
              Edit
            </MenuItem>
            ):(
            <MenuItem onClick={() => {setEditVisitorFlagGateUser(true);setVisitorId(row._id);}} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:cloud-download-fill" />
              Edit
            </MenuItem>
            )
          }
              <Dialog
                fullWidth
                maxWidth="xl"
                // open={flag.value}
                open={editVisitorFlagGateUser}
                onClose={() => {setEditVisitorFlagGateUser(false)}}
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
                    placeholder="Edit Details"
                    value=''
                    onChange={() => {
                      '';
                    }}
  
                    endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
                    inputProps={{
                      sx: { typography: 'h6' },
                    }}
                  />
                </Box>
  
                <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{ renderEditVisitor()}</Scrollbar>
              </Dialog>
            
            <MenuItem onClick={() => {setShowDetailsVisitorFlag(true); setVisitorId(row._id)}} sx={{ color: 'warning.main' }}>
              <Iconify icon="solar:printer-minimalistic-bold" />
              Show Details
            </MenuItem>

            <Dialog
                fullWidth
                maxWidth="sm"
                // open={flag.value}
                open={showDetailsVisitorFlag}
                onClose={() => {setShowDetailsVisitorFlag(false)}}
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
                    placeholder="Accessories"
                    value=''
                    onChange={() => {
                      '';
                    }}
                  
                    endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
                    inputProps={{
                      sx: { typography: 'h6' },
                    }}
                  />
                </Box>
  
                <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderShowDetailsVisitor()}</Scrollbar>
            </Dialog>
  
            <MenuItem onClick={() => {setShowAccFlagGateUser(true); setVisitorId(row._id)}} sx={{ color: 'secondary.main' }}>
              <Iconify icon="solar:share-bold" />
              Show Accessories
            </MenuItem>

              <Dialog
                fullWidth
                maxWidth="lg"
                // open={flag.value}
                open={showAccFlagGateUser}
                onClose={() => {setShowAccFlagGateUser(false)}}
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
                    placeholder="Accessories"
                    value=''
                    onChange={() => {
                      '';
                    }}
                  
                    endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
                    inputProps={{
                      sx: { typography: 'h6' },
                    }}
                  />
                </Box>
  
                <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderShowAcc()}</Scrollbar>
              </Dialog>
            

          {row.in_time ?
            (
            <MenuItem disabled onClick={() => {setAddAccFlag(true); setVisitorId(row._id)}} sx={{ color: 'primary.main' }}>
              <Iconify icon="basil:add-solid" />
              Add Accessories
            </MenuItem> 
            ):( 
            <MenuItem onClick={() => {setAddAccFlagGateUser(true); setVisitorId(row._id)}} sx={{ color: 'primary.main' }}>
              <Iconify icon="basil:add-solid" />
              Add Accessories
            </MenuItem>
            )
          }

            <Dialog
                fullWidth
                maxWidth="md"
                // open={flag.value}
                open={addAccFlagGateUser}
                onClose={() => {setAddAccFlagGateUser(false)}}
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
                    placeholder="Add Accessory"
                    value=''
                    onChange={() => {
                      '';
                    }}
                  
                    endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
                    inputProps={{
                      sx: { typography: 'h6' },
                    }}
                  />
                </Box>
  
                <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderAddAcc()}</Scrollbar>
            </Dialog>
              
            <Divider sx={{ borderStyle: 'dashed' }} />
  
            {/* <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem> */}
        </CustomPopover>

        <InDialog
          open={confirmIn.value}
          onClose={confirmIn.onFalse}
          row={row}
        />

        <OutDialog
          open={confirmOut.value}
          onClose={confirmOut.onFalse}
          row={row}
        />

      </>
    );
  }
  
  VisitorDetailsRow.propTypes = {
    row: PropTypes.object,
  };
  
  function applyFilter({ inputData, comparator}) {
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