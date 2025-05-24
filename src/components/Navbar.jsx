import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar,
  Typography, Autocomplete, TextField
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

const drawerWidth = 240;
const API_KEY = "aaaa92c472f04655bb05c36a224af70b";

function Navbar({ window, onBuscarCidade }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [cidadeSelecionada, setCidadeSelecionada] = React.useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  const handleBuscarClick = () => {
    if (cidadeSelecionada) {
      onBuscarCidade(cidadeSelecionada);
    }
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
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const handleSelect = (event, novaCidade) => {
    setCidadeSelecionada(novaCidade);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" position="static">
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Que tempo???
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Digite a cidade" variant="filled" size="small" />
              )}
            />

            <IconButton
              onClick={handleBuscarClick}
              aria-label="buscar cidade"
              color="inherit"
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="h6">Menu</Typography>
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
