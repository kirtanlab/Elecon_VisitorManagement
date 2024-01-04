/* eslint-disable */
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
// utils
import { useEffect } from 'react';
import { fNumber } from 'src/utils/format-number';
// components
import WidgetSummary from '../../../components/widget/widget-summary';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Container } from '@mui/system';
import axios from 'axios';
import { Grid, LinearProgress } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------
const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function TransactionRender({ title, subheader, list, sx, ...other }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const [transactionCount, setTransactionCount] = useState([])


  const getAllTransactionCounts = async() => {
    try{
      const URL = "http://localhost:5000/api/v1/transaction/analysis/getCount"
      const res = await axios.get(URL)
      setTransactionCount(res?.data?.data);
    }
    catch(err){
      alert("something went wrong in get all transaction counts");
      console.log(err);

    }
  }

  useEffect(() => {
    getAllTransactionCounts()
  }, [])

  const carousel = useCarousel({
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>   <Box sx={{ py: 2, ...sx }} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={<CarouselArrows onNext={carousel.onNext} onPrev={carousel.onPrev} />}
        sx={{
          p: 0,
          mb: 3,
          // border:"2px solid black",
          //   width:100,
          //   height:1000
        }}

      />

      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings} sx={{ border: "2px solid red" }}>
        {transactionCount ? transactionCount.map((item) => {
          return <TransactionItem key={item.id} item={item} />
        }) : <LinearProgress/>}
      </Carousel>
    </Box>
      <Grid container spacing={3} marginTop={4}>
        <Grid xs={12} md={6} lg={4}>
          {/* <CurrentTransactions
            title="Current Transactions"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          /> */}
          {
            transactionCount ? 
            <CurrentTransactions
              title="Current Transactions"
              chart={{
                series: transactionCount 
              }}
            /> : <LinearProgress/>

          }
        </Grid>
        <Grid xs={12} md={6} lg={8} >
          <YearlyTransactions
            title="Yearly Transactions"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Total Income',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'Total Expenses',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Total Income',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'Total Expenses',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
      </Grid>


    </Container>

  );
}

TransactionRender.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
};

//--------------------------------------------------------------------------------

function TransactionItem({ item }) {
  const { title, total } = item;

  useEffect(() => {
    console.log("here in transaction item")
  }, [])

  return (
    <Paper
      sx={{
        mr: 3,
        borderRadius: 2,
        position: 'relative',
        bgcolor: 'background.neutral',
        // border: '2px solid red'
      }}
    >
      <WidgetSummary
        title={title}
        total={total}
      // icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
      />
    </Paper>
  );
}

TransactionItem.propTypes = {
  item: PropTypes.object,
};

//--------------------------------------------------------------------------------

function YearlyTransactions({ title, subheader, chart, ...other }) {
  const { colors, categories, series, options } = chart;

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState('2019');

  const chartOptions = useChart({
    colors,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover]
  );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 0.5,
                borderRadius: 1,
                typography: 'subtitle2',
                bgcolor: 'background.neutral',
              }}
            >
              {seriesData}

              <Iconify
                width={16}
                icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
          }
        />

        {series.map((item) => (
          <Box key={item.year} sx={{ mt: 3, mx: 3 }}>
            {item.year === seriesData && (
              <Chart dir="ltr" type="area" series={item.data} options={chartOptions} height={364} />
            )}
          </Box>
        ))}
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series.map((option) => (
          <MenuItem
            key={option.year}
            selected={option.year === seriesData}
            onClick={() => handleChangeSeries(option.year)}
          >
            {option.year}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

YearlyTransactions.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function CurrentTransactions({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  // const chartSeries = series.map((i) => i.value);
  const chartSeries = series.map((i) => i.total);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    // labels: series.map((i) => i.label),
    labels: series.map((i) => i.title),
    stroke: { colors: [theme.palette.background.paper] },
    legend: {
      offsetY: 0,
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (value) => fNumber(value),
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="donut"
        series={chartSeries}
        options={chartOptions}
        height={280}
      />
    </Card>
  );
}

CurrentTransactions.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};


