import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fData } from 'src/utils/format-number';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function RadialBar({ data, total, chart, ...other }) {
  const theme = useTheme();

  const { colors = [theme.palette.info.main, theme.palette.info.dark], series, options } = chart;

  const chartOptions = useChart({
    chart: {
      offsetY: -16,
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      padding: {
        top: 24,
        bottom: 24,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '56%',
        },
        dataLabels: {
          name: {
            offsetY: 8,
          },
          value: {
            offsetY: -40,
          },
          total: {
            label: `Resolved of ${total?.resolvedCount} / ${total?.total}`,
            color: theme.palette.text.disabled,
            fontSize: theme.typography.body2.fontSize,
            fontWeight: theme.typography.body2.fontWeight,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0] },
          { offset: 100, color: colors[1] },
        ],
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <Chart type="radialBar" series={[series]} options={chartOptions} height={360} />

      <Stack spacing={3} sx={{ px: 3, pb: 5 }}>
        {data.map((category) => (
          <Stack key={category.name} spacing={2} direction="row" alignItems="center">
            {/* <Box sx={{ width: 40, height: 40 }}>{category.icon}</Box> */}

            <ListItemText
              primary={category.name}
            //   secondary={`${category.filesCount} files`}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />

            <Box sx={{ typography: 'subtitle2' }}> {category.count} </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

RadialBar.propTypes = {
  chart: PropTypes.object,
  data: PropTypes.array,
  total: PropTypes.object,
};
