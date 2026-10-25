import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../components/Footer/Footer';
import { Navbar } from '../../components/Navbar/Navbar';
import { WatchCard } from '../../components/WatchCard/WatchCard';
import { useFavoritesStore } from '../../store/useFavoritesStore';

export function Favorites() {
  const navigate = useNavigate();
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 5, minHeight: '60vh' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Mis favoritos
        </Typography>

        {favorites.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Todavía no tienes productos favoritos</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Usa el corazón en un reloj para guardarlo aquí.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 3 }}>
              Explorar relojes
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {favorites.map((watch) => (
              <Grid key={watch._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <WatchCard watch={watch} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Footer />
    </>
  );
}
