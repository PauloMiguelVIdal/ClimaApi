import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Autocomplete,
  TextField,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

const drawerWidth = 240;
const API_KEY = "aaaa92c472f04655bb05c36a224af70b";

function Navbar({ window, onBuscarCidade }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([  { label: "São Paulo, SP", lat: -23.55, lon: -46.63 },
    { label: "Goiânia, GO", lat: -16.68, lon: -49.25 },
    { label: "Natal, RN", lat: -5.79, lon: -35.21 },]);
  const [cidadeSelecionada, setCidadeSelecionada] = React.useState(null);
  const theme = useTheme();

  const handleDrawerToggle = () => setMobileOpen(prev => !prev);

  const handleBuscarClick = () => {
    if (cidadeSelecionada) onBuscarCidade(cidadeSelecionada);
  };

  React.useEffect(() => {
    if (inputValue.length < 3) return;

    const timeout = setTimeout(() => {
      axios.get("https://api.geoapify.com/v1/geocode/autocomplete", {
        params: {
          text: inputValue,
          filter: "countrycode:br",
          type: "city",
          limit: 5,
          apiKey: API_KEY,
        },
      }).then(res => {
        const lista = res.data.features.map((item) => ({
          label: `${item.properties.city || item.properties.name}, ${item.properties.state}`,
          lat: item.properties.lat,
          lon: item.properties.lon,
        }));
        setOptions(lista);
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const handleSelect = (event, novaCidade) => setCidadeSelecionada(novaCidade);

  const container = window !== undefined ? () => window().document.body : undefined;


  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        component="nav"
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            paddingY: 1,
            paddingX: { xs: 1, sm: 3 },
          }}
        >
          <IconButton
            color="default"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f3f4f6',
              borderRadius: 2,
              paddingX: 1,
              width: { xs: '100%', sm: 'auto' },
              flexGrow: 1,
              maxWidth: 500,
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <Autocomplete
              disablePortal
              options={options}
              value={cidadeSelecionada}
              onChange={handleSelect}
              inputValue={inputValue}
              onInputChange={(e, newValue) => setInputValue(newValue)}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label
              }
              isOptionEqualToValue={(option, value) => option.label === value.label}
              sx={{ flexGrow: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Buscar cidade..."
                  variant="standard"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                  }}
                />
              )}
            />
            <IconButton
              onClick={handleBuscarClick}
              aria-label="buscar cidade"
              size="small"
              sx={{ ml: 1 }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <strong>Menu</strong>
          </Box>
        </Drawer>
      </nav>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
  onBuscarCidade: PropTypes.func.isRequired,
};

export default Navbar;
