import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CloudQueueOutlinedIcon from '@mui/icons-material/CloudQueueOutlined';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function Container({ data, temperaturaMin, temperaturaMax }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        <Grid size={4}>
          <Item>{data}</Item>
        </Grid>
        <Grid size={4}>
          <Item><LocationCityOutlinedIcon/>Votuporanga-sp</Item>
        </Grid>
        <Grid size={2}>
          <Item><DeviceThermostatOutlinedIcon/>{temperaturaMin}</Item>
        </Grid>
        <Grid size={2}>
          <Item><DeviceThermostatOutlinedIcon/>{temperaturaMax}</Item>
        </Grid>
      </Grid>
    </Box>
  );
}
