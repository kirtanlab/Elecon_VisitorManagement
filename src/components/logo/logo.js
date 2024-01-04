import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      {/* <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>

        <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
          <path
            fill="url(#BG1)"
            d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z"
          />
          <path
            fill="url(#BG2)"
            d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994"
          />
          <path
            fill="url(#BG3)"
            d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48"
          />
        </g>
      </svg> */}

<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
width="100%" height="100%" viewBox="0 0 200 200">

<g transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M920 1994 c-204 -126 -351 -318 -395 -519 -24 -106 -16 -318 15 -425
60 -208 199 -376 383 -464 117 -56 174 -68 352 -72 l160 -3 -90 19 c-356 76
-585 256 -682 535 -26 75 -27 91 -28 245 0 145 3 174 23 240 57 181 157 332
301 453 25 20 42 37 40 37 -3 0 -38 -21 -79 -46z"/>
<path d="M1252 1940 c-151 -40 -273 -133 -364 -275 -83 -131 -113 -237 -105
-379 8 -165 67 -292 195 -425 51 -52 67 -65 53 -41 -64 105 -93 164 -122 250
-29 84 -33 108 -33 210 -1 96 3 127 23 189 45 138 163 281 294 359 100 60 188
84 327 91 l125 6 -50 13 c-27 7 -99 15 -160 18 -88 3 -124 0 -183 -16z"/>
<path d="M1465 1793 c-111 -15 -218 -65 -295 -139 -104 -99 -150 -213 -155
-384 -2 -63 -2 -104 1 -90 69 347 255 530 538 530 163 0 294 -56 415 -179 63
-62 71 -68 51 -35 -134 224 -327 327 -555 297z"/>
<path d="M1430 1547 c-82 -28 -151 -72 -215 -137 l-50 -51 105 54 c122 62 198
81 301 76 93 -5 166 -39 238 -110 77 -78 104 -142 109 -257 4 -80 -8 -205 -25
-261 -2 -9 5 0 16 19 33 56 60 135 71 205 48 303 -260 561 -550 462z"/>
<path d="M1470 1315 c0 -30 -3 -55 -6 -55 -12 0 -51 24 -77 48 l-27 26 -28
-27 -27 -28 35 -29 c110 -93 234 -91 345 4 l30 26 -29 26 -29 25 -26 -24 c-25
-23 -63 -47 -75 -47 -3 0 -6 25 -6 55 l0 55 -40 0 -40 0 0 -55z"/>
<path d="M1252 1220 l-23 -31 30 -35 c45 -51 41 -64 -19 -64 l-50 0 0 -40 0
-40 56 0 c47 0 55 -3 50 -16 -3 -9 -6 -20 -6 -24 0 -5 -14 -25 -31 -45 l-32
-36 23 -24 24 -25 28 27 c16 15 40 51 55 80 42 87 24 182 -50 268 l-32 37 -23
-32z"/>
<path d="M1710 1213 c-94 -106 -94 -234 0 -343 l30 -35 25 30 24 30 -29 30
c-16 16 -32 42 -35 58 -7 27 -7 27 44 27 l51 0 0 40 0 40 -50 0 c-27 0 -50 2
-50 5 0 16 33 66 51 79 l22 15 -26 30 -25 31 -32 -37z"/>
<path d="M1470 1127 c-32 -16 -54 -61 -46 -93 24 -93 166 -82 166 13 0 45 -9
62 -41 78 -34 18 -47 18 -79 2z"/>
<path d="M1463 921 c-40 -10 -112 -52 -138 -81 l-20 -22 29 -25 c25 -21 30
-22 38 -10 9 18 70 57 87 57 7 0 11 -19 11 -50 l0 -50 40 0 40 0 0 50 c0 61
14 65 68 16 l38 -35 30 24 29 23 -24 26 c-30 32 -113 73 -161 80 -19 2 -49 1
-67 -3z"/>
</g>
</svg>

    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
