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
import { Grid, LinearProgress } from '@mui/material';
import { Container } from '@mui/system';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';

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

export default function MasterRender({ title, subheader, list, sx, ...other }) {
  const theme = useTheme();

  const settings = useSettingsContext();
  const [masterCount, setMasterCount] = useState([]);

  const getMasterCount = async() => {
    try{
      const URL = "http://localhost:5000/api/v1/master/analysis/getCount"
      const res = await axios.get(URL)
      setMasterCount(res?.data?.data);
    }
    catch(err){
      alert("something went wrong in get master count");
      console.log(err);

    }
  }
  useEffect(() => {
    getMasterCount();
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
        {masterCount ? masterCount.map((item) => {
          return <MasterItem key={item.id} item={item} />
        }) : <LinearProgress/>}
      </Carousel>
    </Box>
     


    </Container>

  );
}

MasterRender.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
};

//--------------------------------------------------------------------------------

function MasterItem({ item }) {
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

MasterItem.propTypes = {
  item: PropTypes.object,
};
