// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// routes
import Router from 'src/routes/sections';
// theme
import ThemeProvider from 'src/theme';
// hooks
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
// components
import ProgressBar from 'src/components/progress-bar';
import MotionLazy from 'src/components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
// auth
import { AuthProvider, AuthConsumer } from 'src/auth/context/jwt';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { VisitorProvider } from './context/visitor_context';

import { NotificationProvider } from './context/notification_context';

import { GrievanceProvider } from './context/grievance_context';
import { AdminMISProvider } from './context/admin_mis_context';



// ----------------------------------------------------------------------

export default function App() {
  const charAt = `

  ░░░    ░░░
  ▒▒▒▒  ▒▒▒▒
  ▒▒ ▒▒▒▒ ▒▒
  ▓▓  ▓▓  ▓▓
  ██      ██

  `;

  console.info(`%c${charAt}`, 'color: #5BE49B');

  useScrollToTop();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AuthProvider>
      <AdminMISProvider>
      <NotificationProvider>
      <GrievanceProvider>
      <VisitorProvider>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'light', // 'light' | 'dark'
          themeDirection: 'ltr', //  'rtl' | 'ltr'
          themeContrast: 'bold', // 'default' | 'bold'
          themeLayout: 'horizontal', // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: 'purple', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <MotionLazy>
            <SettingsDrawer />
            <ProgressBar />
            <AuthConsumer>
              <Router />
            </AuthConsumer>
          </MotionLazy>
        </ThemeProvider>
      </SettingsProvider>
      </VisitorProvider>

      </GrievanceProvider>
      </NotificationProvider>
      </AdminMISProvider>
    </AuthProvider>
    </LocalizationProvider>
  );
}
