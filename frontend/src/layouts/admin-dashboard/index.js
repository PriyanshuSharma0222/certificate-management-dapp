import { useContext, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import AdminDashboardLayout from "layouts/authentication/components/AdminDashboardLayout";
import BillingInformation from "layouts/admin-dashboard/components/BillingInformation";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import AuthService from "services/auth-service";
import { AuthContext } from "context";

function AdminDashboard() {
  return (
    <AdminDashboardLayout image={bgImage}>
      <MDBox mb={3}  width="100%">
          <Grid container spacing={3} mt={2}>
              <BillingInformation />
          </Grid>
        </MDBox>
    </AdminDashboardLayout>
  );
}

export default AdminDashboard;
