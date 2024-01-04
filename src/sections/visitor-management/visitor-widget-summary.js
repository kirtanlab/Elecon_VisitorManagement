import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// theme
import { bgGradient } from 'src/theme/css';
// utils
// import { fShortenNumber } from 'src/utils/format-number';
// theme

// ----------------------------------------------------------------------

export default function VisitorWidgetSummary({
  title,
  total,
  icon,
  color = 'primary',
  sx
}) {
  const theme = useTheme();

  return (
    <Stack
      alignItems="center"
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.4),
        }),
        py: 5,
        borderRadius: 2,
        textAlign: 'center',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      
    >
      {icon && <Box sx={{ width: 64, height: 64, mb: 1 }}>{icon}</Box>}

      <Typography variant="h5">{total}</Typography>

      <Typography variant="subtitle1" sx={{ opacity: 0.64 }}>
        {title}
      </Typography>
    </Stack>
  );
}

VisitorWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
