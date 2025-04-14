// src/components/RequestForm.js
import React, { useState } from "react";
import { getContract } from "../dapp/contract";
import { storeAadhaarMetadata } from "../dapp/ipfs";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

const RequestForm = () => {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    address: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const ipfsHash = await storeAadhaarMetadata({
        name: form.name,
        dob: form.dob,
        gender: form.gender,
        address: form.address,
    });
    
    const contract = await getContract();
    const tx = await contract.requestAadhaar(
      form.name,
      form.dob,
      form.gender,
      form.address,
      `ipfs://${ipfsHash}`
    );
    console.log( form.name,
        form.dob,
        form.gender,
        form.address,
        ipfsHash);
    await tx.wait();
    localStorage.setItem('cid', ipfsHash);
    console.log("Aadhaar request submitted!");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} />
                <input name="dob" placeholder="Date of Birth" onChange={handleChange} />
                <input name="gender" placeholder="Gender" onChange={handleChange} />
                <input name="address" placeholder="Address" onChange={handleChange} />
                <button type="submit">Submit Aadhaar Request</button>
            </form>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default RequestForm;