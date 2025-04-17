/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import Icon from "@mui/material/Icon"
// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

import { useState, useEffect } from "react";  
import { getContract } from "dapp/contract";
import { ethers } from "ethers";

export default function data() {
  const [requestsData, setRequestsData] = useState([]);

  const statusColor = {
    "Approved": "success",
    "Rejected": "error",
    "Pending":"info",
  };
  
  const [rowsData, setRowsData] = useState([]);
  
  
  const loadRequests = async () => {
    const {contract, signer} = await getContract();
    console.log("Request Status Signer :", signer);
    
    const userAddress = await signer.getAddress();
    console.log(userAddress);
    
    const requestIDs = await contract.getUserRequests(userAddress);
    console.log(requestIDs);
    
    const all = [];
    const tempRowsData = [];

    for (let id of requestIDs) {
      const res = await contract.getRequestDetails(id);
      console.log("Request Details :", id, res);
      
      const statusEnum = ["Pending", "Approved", "Rejected"];
      const request = {
        requestId: id,
        name: res[1],
        dob: res[2],
        gender: res[3],
        contact: res[4],
        addressDetails: res[5],
        ipfsHash: res[6],
        status: statusEnum[res[7]],
        tokenId: res[8],
      };
      console.log(request);
      
      all.push(request);
      tempRowsData.push({
        document: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <Icon fontSize="large" color="info">
                  {"description"}
            </Icon>
            <MDBox ml={2} lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
                {res[1]}
              </MDTypography>
            </MDBox>
          </MDBox>
        ),
        ipfs: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {res[6]}
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent={statusEnum[res[7]]} color="{statusColor[statusEnum[res[7]]]}" variant="gradient" size="sm" />
          </MDBox>
        ),
      },);
    }
    setRowsData(tempRowsData);
    console.log(rowsData);
    setRequestsData(all);
  } 
  
  useEffect(() => {
    loadRequests();
  },[]);

  return {
    columns: [
      { Header: "document", accessor: "document", width: "25%", align: "left" },
      { Header: "ipfs", accessor: "ipfs", width: "50%", align: "center" },
      { Header: "status", accessor: "status", width: "25%", align: "center" },
    ],

    rows: rowsData,
  };
}
