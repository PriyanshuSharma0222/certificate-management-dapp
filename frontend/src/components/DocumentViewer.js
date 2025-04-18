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
import React, { useState, useEffect } from "react";

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
import DocumentCard from "./DocumentCard.js";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import UserService from "services/user-service.js";
import { getContract } from "dapp/contract.js";


function DocumentViewer() {
	const [requests, setRequests] = useState([]);
  const [userAddress, setUserAddress] = useState("");

  const fetchCertificates = async () => {
      const {contract, signer} = await getContract();
      if (!contract) return;
      
      const address = await signer.getAddress();
      setUserAddress(address);

      const requestIds = await contract.getUserRequests(address);

      const allRequests = await Promise.all(
        requestIds.map(async (id) => {
          const data = await contract.getRequestDetails(id);
          return {
            requestId: id,
            user: data[0],
            docType: data[1],
            name: data[2],
            dob: data[3],
            gender: data[4],
            contact: data[5],
            addressDetails: data[6],
            ipfsHash: data[7],
            status: data[8],
            tokenId: data[9],
          };
        })
      );
      const approvedOnly = allRequests.filter((req) => req.status == 1); // 1 = Approved
      setRequests(approvedOnly);
    };

    useEffect(() => {
      fetchCertificates();
    }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
					{requests.map((request, index) => (
            <Grid item xs={12} md={6} lg={3} key={request.requestId || index}>
              <MDBox mb={1.5}>
                <DocumentCard
                  color="info"
                  icon="description"
                  title={request.docType}
                  name={request.name}
                  dob={request.dob}
                  gender={request.gender}
                  contact={request.contact}
                  addressDetails={request.addressDetails}
                  ipfsHash={request.ipfsHash}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DocumentViewer;
