import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { toast } from "react-toastify";
import { Navbar } from "../../components/Navbar/Navbar";
import { SpinnerLoading } from "../../components/SpinnerLoading/SpinnerLoading";
import { Footer } from "../../components/Footer/Footer";
import { useHook } from "./useHook";
import rolexSubmarinerBlue from "../../assets/submariner_blue.avif";
import { useCartStore } from "../../store/useCartStore";
import { getUser } from "../../services/auth";

const formatPrice = (price: number) => `$${price.toLocaleString("es-MX")}`;

export const ShoppingCart = () => {
  const { isLoading, watches, idsProductsInCart } = useHook();
  const changeQuantity = useCartStore((state) => state.changeQuantity);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  const cartRows = idsProductsInCart.flatMap((cartItem) => {
    const watch = watches.find((item) => item._id === cartItem.productId);
    if (!watch) return [];

    const price = Number(cartItem.price ?? watch.price);
    const quantity = cartItem.quantity;
    return {
      watch,
      price,
      quantity,
      total: price * quantity,
    };
  });
  const totalToPay = cartRows.reduce((total, row) => total + row.total, 0);

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, py: 5, minHeight: "60vh" }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Carrito de compras
        </Typography>

        {cartRows.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6">Tu carrito está vacío</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Agrega un reloj para verlo aquí.
            </Typography>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table aria-label="Productos en el carrito">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartRows.map(({ watch, price, quantity, total }) => (
                    <TableRow key={watch._id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 180 }}>
                          <Box
                            component="img"
                            src={watch.imagePath || rolexSubmarinerBlue}
                            alt={watch.name}
                            sx={{ width: 80, height: 80, objectFit: "contain", flexShrink: 0 }}
                          />
                          <Typography sx={{ fontWeight: 600 }}>{watch.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatPrice(price)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                          <IconButton
                            aria-label={`Restar una unidad de ${watch.name}`}
                            size="small"
                            onClick={() => changeQuantity(watch._id, -1, getUser()?._id ?? "")}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography component="span" sx={{ minWidth: 2, textAlign: "center" }}>
                            {quantity}
                          </Typography>
                          <IconButton
                            aria-label={`Agregar una unidad de ${watch.name}`}
                            size="small"
                            onClick={() => changeQuantity(watch._id, 1, getUser()?._id ?? "")}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatPrice(total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box>
                <Typography color="text.secondary">Total a pagar</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {formatPrice(totalToPay)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                endIcon={<ShoppingCartCheckoutIcon />}
                onClick={() => toast.info("La integración del proceso de pago aún no está configurada.")}
                sx={{ px: 4, py: 1.5 }}
              >
                Proceder a pagar
              </Button>
            </Paper>
          </>
        )}
      </Box>
      <Footer />
    </>
  );
};
