import { Container } from '@mui/system';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthContext } from 'src/auth/hooks';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import HomeView from './admin/admin-home-view';


// ----------------------------------------------------------------------

export default function AdminHomePage() {
  const {user} = useAuthContext();
  const settings = useSettingsContext();
  useEffect(() => {
    console.log("in home page", user);
    console.log(sessionStorage.getItem("id"))
    console.log(sessionStorage.getItem("role"))
    console.log(sessionStorage.getItem("accessToken"))
  })
  return (
    <>
      <Helmet>
        <title> Admin Home</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Employee"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <HomeView/>

      {/* ---- this file is not being rendered or used , this content is im the file admin-table.js */}
      
    </Container>

    </>
  );
}
