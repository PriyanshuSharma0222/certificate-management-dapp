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

import {useState, useEffect} from "react";
 
// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import Bill from "layouts/admin-dashboard/components/Bill";
import { getContract } from "dapp/contract";


function BillingInformation() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    const {contract, signer} = await getContract();
    console.log("Billing Info Signer :", signer);
    
    const userAddress = await signer.getAddress();
    console.log(userAddress);
    
    const tokenCounter = await contract.tokenCounter();
    console.log("tokenCounter", tokenCounter);
    
    const allRequests = [];

    for (let i = 1; i < tokenCounter; i++) {
      const requestDetails = await contract.getRequestDetails(i);
      console.log(requestDetails);
      
      const user = requestDetails[0];
      const docType = requestDetails[1];
      const name = requestDetails[2];
      const dob = requestDetails[3];
      const gender = requestDetails[4];
      const contact = requestDetails[5];
      const addressDetails = requestDetails[6];
      const ipfsHash = requestDetails[7];
      const status = requestDetails[8];
      const tokenId = requestDetails[9];
      
      if (status == 0) {
        allRequests.push({ requestId: i, user, docType, name, dob, gender, contact, addressDetails, ipfsHash, status, tokenId});
      }
    }

    setRequests(allRequests);
    console.log(requests);
  } 
  
  useEffect(() => {
    loadRequests();
  },[]);


  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}  width="100vw">
        <MDTypography variant="h6" fontWeight="medium">
          Pending Requests
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} width="100%">
        <MDBox component="ul" display="flex" flexDirection="column" p={0} width="100%">
          {requests.map((request, index) => (
            <Bill
              key = {index}
              requestID = {request.requestId}
              user = {request.user}
              docType = {request.docType}
              name = {request.name}
              dob = {request.dob}
              gender = {request.gender}
              contact = {request.contact}
              addressDetails = {request.addressDetails}
              ipfsHash = {request.ipfsHash}
              tokenId = {request.tokenId}
              loadRequests = {loadRequests}
            />
          ))}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
