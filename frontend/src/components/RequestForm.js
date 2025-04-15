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
  const [user, setUser] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nameError: false,
    dobError: false,
    genderError: false,
    addressError: false,
    contactError: false,
  });

  const getUserData = async () => {
    const response = await AuthService.getProfile();
    if (response.data.id == 1) {
      setIsDemo(process.env.REACT_APP_IS_DEMO === "true");
    }
    setUser((prevUser) => ({
      ...prevUser,
      ...response.data.attributes,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const path = window.location.pathname;
  const docName = path.substring(path.lastIndexOf('/')+1);

  const [docCred, setDocCred] = useState({
    name: "",
    dob: "",
    gender: "",
    address: "",
    contact: "",
  });

  useEffect(() => {
    getUserData();
  }, []);

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

    if (user.name.trim().length === 0) {
      setErrors({ ...errors, nameError: true });
      return;
    }

    const ipfsHash = await storeDocMetadata({
        name: docCred.name,
        dob: docCred.dob,
        gender: docCred.gender,
        contact: docCred.contact,
        address: docCred.address,
    });
    
    const contract = await getContract();
    const tx = await contract.requestDocument(
      docCred.name,
      docCred.dob,
      docCred.gender,
      docCred.contact,
      docCred.address,
      `ipfs://${ipfsHash}`
    );
    console.log( docCred.name,
        docCred.dob,
        docCred.gender,
        docCred.contact,
        docCred.address,
        ipfsHash);
    await tx.wait();
    localStorage.setItem('cid', ipfsHash);

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
                  onChange={changeHandler}
                  error={errors.nameError}
                />
                {errors.nameError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The name can not be null
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
                    The DOB must be valid
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
                      Invalid
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
                    placeholder="enter 10 digits"
                    value={docCred.contact}
                    onChange={changeHandler}
                    error={errors.contactError}
                    disabled={isDemo}
                  />
                  {errors.contactError && (
                    <MDTypography variant="caption" color="error" fontWeight="light">
                      Invalid
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
                    placeholder=""
                    value={docCred.address}
                    onChange={changeHandler}
                    error={errors.addressError}
                    disabled={isDemo}
                  />
                  {errors.genderError && (
                    <MDTypography variant="caption" color="error" fontWeight="light">
                      Invalid
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