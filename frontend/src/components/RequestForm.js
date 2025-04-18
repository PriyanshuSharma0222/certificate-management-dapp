// src/components/RequestForm.js
import React from "react";
import { getContract } from "../dapp/contract";
import { storeDocMetadata } from "../dapp/ipfs";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useState, useEffect } from "react";
// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
// Overview page components
import RequestFormHeader from "./RequestFormHeader";
import AuthService from "../services/auth-service";

const RequestForm = () => {
  const [isDemo, setIsDemo] = useState(false);
  const [notification, setNotification] = useState(false);
  const [requestsData, setRequestsData] = useState([]);

  const [errors, setErrors] = useState({
    nameError: false,
    dobError: false,
    genderError: false,
    addressError: false,
    contactError: false,
  });

  const path = window.location.pathname;
  const docName = path.substring(path.lastIndexOf('/')+1);

  const [docCred, setDocCred] = useState({
    docType: docName,
    name: "",
    dob: "",
    gender: "",
    address: "",
    contact: "",
  });

  const loadRequests = async () => {
    const {contract, signer} = await getContract();
    console.log("Request Status Signer :", signer);
    
    const userAddress = await signer.getAddress();
    console.log(userAddress);
    
    const requestIDs = await contract.getUserRequests(userAddress);
    console.log(requestIDs);
    
    const all = [];

    for (let id of requestIDs) {
      const res = await contract.getRequestDetails(id);
      console.log("Request Details :", id, res);
      
      const statusEnum = ["Pending", "Approved", "Rejected"];
      const request = {
        requestId: id,
        docType: res[1],
        name: res[2],
        dob: res[3],
        gender: res[4],
        contact: res[5],
        addressDetails: res[6],
        ipfsHash: res[7],
        status: res[8],
        tokenId: res[9],
      };
      console.log(request);
      all.push(request);
    }
    setRequestsData(all);
  } 

  useEffect(() => {
    if (notification === true) {
      setTimeout(() => {
        setNotification(false);
      }, 5000);
    }
  }, [notification]);

  const changeHandler = (e) => {
    setDocCred({
      ...docCred,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const err = {
      nameError: false,
      dobError: false,
      genderError: false,
      addressError: false,
      contactError: false,
    };
  
    let hasError = false;
  
    if (!docCred.name || docCred.name.trim().length < 3) {
      err.nameError = true;
      hasError = true;
    }
  
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!docCred.dob || !dobRegex.test(docCred.dob)) {
      err.dobError = true;
      hasError = true;
    }
  
    const validGenders = ["Male", "Female"];
    if (!docCred.gender || !validGenders.includes(docCred.gender)) {
      err.genderError = true;
      hasError = true;
    }
  
    if (!docCred.address || docCred.address.trim().length < 3) {
      err.addressError = true;
      hasError = true;
    }
  
    const contactRegex = /^[6-9]\d{9}$/;
    if (!docCred.contact || !contactRegex.test(docCred.contact)) {
      err.contactError = true;
      hasError = true;
    }
    
    setErrors(err);
    if(hasError){
      return;
    }



    const ipfsHash = await storeDocMetadata({
        docType: docName,
        name: docCred.name,
        dob: docCred.dob,
        gender: docCred.gender,
        contact: docCred.contact,
        address: docCred.address,
    });
    
    const {contract, signer} = await getContract();
    const signerAddress = await signer.getAddress();
    console.log("Request Form signer :", signerAddress);
    
    const tx = await contract.requestDocument(
      docName,
      docCred.name,
      docCred.dob,
      docCred.gender,
      docCred.contact,
      docCred.address,
      `ipfs://${ipfsHash}`
    );
    
    await tx.wait();

    console.log("Request submitted!");

    setErrors({
      nameError: false,
      dobError: false,
      genderError: false,
      addressError: false,
      contactError: false,
    });

    setNotification(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <RequestFormHeader name={docName}>
        {notification && (
          <MDAlert color="info" mt="20px">
            <MDTypography variant="body2" color="white">
              Form Submitted
            </MDTypography>
          </MDAlert>
        )}
        <MDBox
          component="form"
          role="form"
          onSubmit={submitHandler}
          display="flex"
          flexDirection="column"
        >
          <MDBox display="flex" flexDirection="row" mt={5} mb={3}>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              mr={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Full Name
              </MDTypography>
              <MDBox mb={2} width="100%">
                <MDInput
                  type="name"
                  fullWidth
                  name="name"
                  value={docCred.name}
                  placeholder="Name"
                  onChange={changeHandler}
                  error={errors.nameError}
                />
                {errors.nameError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    Name must have atleast 3 letters
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              ml={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Date of Birth
              </MDTypography>
              <MDBox mb={1} width="100%">
                <MDInput
                  type="dob"
                  fullWidth
                  name="dob"
                  value={docCred.dob}
                  placeholder="DD/MM/YYYY"
                  onChange={changeHandler}
                  error={errors.dobError}
                  disabled={isDemo}
                />
                {errors.dobError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    Enter a valid Date of Birth DD/MM/YYYY
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
          </MDBox>

          <MDBox display="flex" flexDirection="column" mb={3}>
            <MDBox display="flex" flexDirection="row">
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                mr={2}
              >
                <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                  Gender
                </MDTypography>
                <MDBox mb={2} width="100%">
                  <MDInput
                    type="gender"
                    fullWidth
                    name="gender"
                    placeholder="Male / Female"
                    value={docCred.gender}
                    onChange={changeHandler}
                    error={errors.genderError}
                    disabled={isDemo}
                  />
                  {errors.genderError && (
                    <MDTypography variant="caption" color="error" fontWeight="light">
                      Either Male or Female
                    </MDTypography>
                  )}
                </MDBox>
              </MDBox>
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                ml={2}
              >
                <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                  Contact Number
                </MDTypography>
                <MDBox mb={1} width="100%">
                  <MDInput
                    type="contact"
                    fullWidth
                    name="contact"
                    placeholder="Enter 10 digits"
                    value={docCred.contact}
                    onChange={changeHandler}
                    error={errors.contactError}
                    disabled={isDemo}
                  />
                  {errors.contactError && (
                    <MDTypography variant="caption" color="error" fontWeight="light">
                      Invalid Contact Number
                    </MDTypography>
                  )}
                </MDBox>
              </MDBox>
            </MDBox>
          </MDBox>
          
          <MDBox display="flex" flexDirection="column" mb={3}>
            <MDBox display="flex" flexDirection="row">
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                mr={2}
              >
                <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                  Address
                </MDTypography>
                <MDBox mb={2} width="100%">
                  <MDInput
                    type="address"
                    fullWidth
                    name="address"
                    placeholder="Address"
                    value={docCred.address}
                    onChange={changeHandler}
                    error={errors.addressError}
                    disabled={isDemo}
                  />
                  {errors.addressError && (
                    <MDTypography variant="caption" color="error" fontWeight="light">
                      Address too short
                    </MDTypography>
                  )}
                </MDBox>
              </MDBox>
            </MDBox>
            <MDBox mt={4} display="flex" justifyContent="end">
              <MDButton variant="gradient" color="info" type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </RequestFormHeader>
      <Footer />
    </DashboardLayout>
  );
};

export default RequestForm;