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
import SimpleCard from "./SimpleCard.js";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import UserService from "services/user-service.js";

function RequestDocument() {
	const [docStructData, setDocStructData] = useState([]);

	useEffect(() => {
		const fetchDocumentStructure = async () => {
			try {
				const res = await UserService.getDocumentStructure();
        console.log(res);
				// const data = await res.json();
        // console.log(data);
				setDocStructData(res.data);
			} catch (err) {
				throw new Error("Failed to fetch data 2", err.message);
			}
		};
		fetchDocumentStructure();
	}, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
					{docStructData.map((doc, index) => (
            <Grid item xs={12} md={6} lg={3} key={doc._id?.$oid || index}>
              <MDBox mb={1.5}>
                <SimpleCard
                  color="info"
                  icon="description"
                  title={doc.name}
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

export default RequestDocument;
