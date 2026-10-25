import { Box, Paper, Typography } from '@mui/material';
import { Footer } from '../../components/Footer/Footer';
import { Navbar } from '../../components/Navbar/Navbar';
import { getUser } from '../../services/auth';

export function MyAccount() {
  const user = getUser();
  const userFields = [
    { label: 'Nombre', value: user?.name },
    { label: 'Correo electrónico', value: user?.email },
    { label: 'Edad', value: user?.age },
    { label: 'Género', value: user?.gender },
    { label: 'Teléfono', value: user?.phone },
    { label: 'Dirección', value: user?.address },
  ];

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 3 }, py: 5, minHeight: '60vh' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Mi cuenta
        </Typography>

        {user ? (
          <Paper component="dl" sx={{ m: 0, p: { xs: 2, sm: 4 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' }, gap: 2 }}>
            {userFields.map(({ label, value }) => (
              <Box key={label} sx={{ display: 'contents' }}>
                <Typography component="dt" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {label}
                </Typography>
                <Typography component="dd" sx={{ m: 0, overflowWrap: 'anywhere' }}>
                  {value || 'No disponible'}
                </Typography>
              </Box>
            ))}
          </Paper>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">No se encontraron datos de usuario</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Cierra sesión e inicia nuevamente para cargar los datos de tu cuenta.
            </Typography>
          </Paper>
        )}
      </Box>
      <Footer />
    </>
  );
}
