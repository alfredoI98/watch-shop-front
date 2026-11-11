import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { logout } from '../../services/auth';
import { useCartStore } from '../../store/useCartStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';

type CatalogFilters = {
  brand: string;
  category: string;
  movementType: string;
  waterResistance: string;
};

const emptyFilters: CatalogFilters = {
  brand: '',
  category: '',
  movementType: '',
  waterResistance: '',
};

const getCatalogFilters = (params: URLSearchParams): CatalogFilters => ({
  brand: params.get('brand') ?? '',
  category: params.get('category') ?? '',
  movementType: params.get('movementType') ?? '',
  waterResistance: params.get('waterResistance') ?? '',
});

const filterFields: Array<{ key: keyof CatalogFilters; label: string; placeholder: string }> = [
  { key: 'brand', label: 'Marca', placeholder: 'Ej. Rolex' },
  { key: 'category', label: 'Categoría', placeholder: 'Ej. Deportivo' },
  { key: 'movementType', label: 'Tipo de movimiento', placeholder: 'Ej. Automático' },
  { key: 'waterResistance', label: 'Resistencia al agua', placeholder: 'Ej. 100 m' },
];

const Search = styled('form')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  border: '1px solid #d4af37',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#d4af37',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#d4af37',
    opacity: 0.6,
  },
}));

export function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');
  const [filters, setFilters] = useState<CatalogFilters>(() => getCatalogFilters(searchParams));
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const navigateToCatalog = (searchTerm: string, nextFilters: CatalogFilters) => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());

    filterFields.forEach(({ key }) => {
      const value = nextFilters[key].trim();
      if (value) params.set(key, value);
    });

    navigate({
      pathname: '/',
      search: params.toString() ? `?${params.toString()}` : '',
      hash: '#catalog',
    });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentFilters = getCatalogFilters(searchParams);
    setFilters(currentFilters);
    navigateToCatalog(searchValue, currentFilters);
  };

  const activeFilterCount = filterFields.filter(({ key }) => searchParams.has(key)).length;

  const handleOpenFilters = () => {
    setFilters(getCatalogFilters(searchParams));
    setSearchValue(searchParams.get('search') ?? '');
    setIsFilterDrawerOpen(true);
  };

  // Obtener el total de ítems en el carrito desde Zustand
  const totalItems = useCartStore((state) => 
    state.cart.length
  );
  const totalFavorites = useFavoritesStore((state) => state.favorites.length);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleApplyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToCatalog(searchValue || searchParams.get('search') || '', filters);
    setIsFilterDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    navigateToCatalog(searchValue || searchParams.get('search') || '', emptyFilters);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {
        handleMenuClose();
        navigate('/account');
      }}>
        Mi cuenta
      </MenuItem>
      <MenuItem onClick={() => {
        handleMenuClose();
        navigate('/products/new');
      }}>
        Añadir reloj
      </MenuItem>
      <MenuItem onClick={() => {
        logout();
        navigate('/login');
      }}>
        Cerrar sesión
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => {
        handleMobileMenuClose();
        navigate('/account');
      }}>
        Mi cuenta
      </MenuItem>
      <MenuItem onClick={() => {
        handleMobileMenuClose();
        navigate('/products/new');
      }}>
        Añadir reloj
      </MenuItem>
      <MenuItem onClick={() => {
        handleMobileMenuClose();
        navigate('/favorites');
      }}>
        <IconButton size="large" aria-label="Productos favoritos" color="inherit" sx={{ color: '#d4af37' }}>
          <Badge badgeContent={totalFavorites} color="error">
            <FavoriteIcon />
          </Badge>
        </IconButton>
        <p>Mis favoritos</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit" sx={{ color: '#d4af37' }}>
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Mensajes</p>
      </MenuItem>
      <MenuItem onClick={() => navigate('/cart')}>
        <IconButton
          size="large"
          aria-label="show 4 items in shopping cart"
          color="inherit"
          sx={{ color: '#d4af37' }}
        >
          <Badge badgeContent={totalItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Carrito de compras</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
          sx={{ color: '#d4af37' }}
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>

    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, mb: 7 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#1a1a1a',
          boxShadow: '0 2px 8px rgba(212, 175, 55, 0.15)',
          borderBottom: '1px solid #d4af37',
        }}
      >
        <Toolbar sx={{ backgroundColor: '#1a1a1a' }}>
          <IconButton
            onClick={handleOpenFilters}
            size="large"
            edge="start"
            color="inherit"
            aria-label="Abrir filtros de productos"
            sx={{ mr: 2, color: '#d4af37' }}
          >
            <Badge badgeContent={activeFilterCount} color="warning">
              <MenuIcon />
            </Badge>
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate('/')}
            sx={{
              display: { xs: 'none', sm: 'block' },
              mr: 3,
              background: 'linear-gradient(110deg, #f5e6a8 0%, #d4af37 45%, #fff2bd 70%, #b8902e 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontFamily: '"Palatino Linotype", "Book Antiqua", Georgia, serif',
              fontSize: { sm: '1.05rem', md: '1.25rem' },
              fontWeight: 600,
              letterSpacing: '0.09em',
              textShadow: '0 1px 12px rgba(212, 175, 55, 0.18)',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            Herencia del Tiempo
          </Typography>
          <Search onSubmit={handleSearch}>
            <SearchIconWrapper sx={{ color: '#d4af37' }}>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar relojes…"
              inputProps={{ 'aria-label': 'Buscar relojes' }}
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit" sx={{ color: '#d4af37' }}>
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label={`Mis favoritos: ${totalFavorites} productos`}
              color="inherit"
              sx={{ color: '#d4af37' }}
              onClick={() => navigate('/favorites')}
            >
              <Badge badgeContent={totalFavorites} color="error">
                <FavoriteIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 4 items in shopping cart"
              color="inherit"
              sx={{ color: '#d4af37' }}
              onClick={() => navigate('/cart')}
            >
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ color: '#d4af37' }}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ color: '#d4af37' }}
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              sx={{ color: '#d4af37' }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <Drawer
        anchor="left"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '100%', sm: 380 },
              maxWidth: '100%',
              backgroundColor: '#faf9f6',
            },
          },
        }}
      >
        <Box
          component="form"
          onSubmit={handleApplyFilters}
          sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 3 }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#9b7a20', letterSpacing: '0.16em' }}>
                Herencia del Tiempo
              </Typography>
              <Typography variant="h5" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                Filtrar colección
              </Typography>
            </Box>
            <IconButton aria-label="Cerrar filtros" onClick={() => setIsFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Encuentra tu próximo reloj ajustando los criterios.
          </Typography>
          <Divider sx={{ mb: 2.5 }} />
          <Stack spacing={2.25}>
            {filterFields.map(({ key, label, placeholder }) => (
              <TextField
                key={key}
                label={label}
                placeholder={placeholder}
                value={filters[key]}
                onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}
                size="small"
                fullWidth
              />
            ))}
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ my: 2.5 }} />
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="text"
              onClick={handleClearFilters}
              sx={{ color: '#5f5a4d', textTransform: 'none' }}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<TuneIcon />}
              sx={{
                flexGrow: 1,
                backgroundColor: '#1a1a1a',
                color: '#e3c56b',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Ver resultados
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}