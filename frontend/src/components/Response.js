// src/components/RequestForm.js
import React, { useState, useEffect } from "react";
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

const AadhaarViewer = () => {
    const cid = localStorage.getItem('cid');
    const [aadhaarData, setAadhaarData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const url = `https://gateway.lighthouse.storage/ipfs/${cid}`;
          const res = await fetch(url);
          const data = await res.json();
          setAadhaarData(data);
        } catch (err) {
          console.error("Error fetching Aadhaar metadata:", err);
        }
      };
      fetchData();
    }, [cid]);
  
    if (!aadhaarData) return <p>Loading...</p>;
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
            <div className="p-4 rounded shadow">
            <h2 className="text-xl font-bold">Aadhaar Info</h2>
            <p><strong>Name:</strong> {aadhaarData.name}</p>
            <p><strong>DOB:</strong> {aadhaarData.dob}</p>
            <p><strong>Gender:</strong> {aadhaarData.gender}</p>
            <p><strong>Address:</strong> {aadhaarData.address}</p>
            {/* {aadhaarData.image && (
                <img
                src={`https://gateway.lighthouse.storage/ipfs/${aadhaarData.image.replace('ipfs://', '')}`}
                alt="Aadhaar"
                className="w-48 mt-4 rounded"
                />
            )} */}
            </div>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default AadhaarViewer;
