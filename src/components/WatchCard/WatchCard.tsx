import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import rolex_submariner_blue from "/src/assets/submariner_blue.avif";
import type { Watch } from "../../interfaces/watch";
import { useCartStore } from '../../store/useCartStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { getUser } from '../../services/auth';

export function WatchCard({ watch }: { watch: Watch }) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isMagnifierVisible, setIsMagnifierVisible] = useState(false);
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 50, y: 50 });
    const [magnifierZoom, setMagnifierZoom] = useState(2.6);
    const imageUrl = watch.imagePath ? watch.imagePath : rolex_submariner_blue;
    const descriptionWords = watch.description.trim().split(/\s+/);
    const isLongDescription = descriptionWords.length > 20;
    const addItem = useCartStore((state) => state.addItem);
    const getProductStock = useCartStore((state) => state.getProductStock);
    const availableStock = getProductStock(watch._id, watch.stock);
    const isFavorite = useFavoritesStore((state) =>
        state.favorites.some((favorite) => favorite._id === watch._id)
    );
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

    const handleMagnifierMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;

        setMagnifierPosition({
            x: Math.min(Math.max(x, 12), 88),
            y: Math.min(Math.max(y, 12), 88),
        });
    };

    const handleMagnifierWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        setMagnifierZoom((currentZoom) => {
            const nextZoom = event.deltaY > 0 ? currentZoom - 0.2 : currentZoom + 0.2;
            return Math.min(Math.max(nextZoom, 1.8), 4.2);
        });
    };

    const formattedPrice = (() => {
        const numericValue = Number(watch.price ?? 0);

        if (!Number.isFinite(numericValue)) {
            return '$0.00';
        }

        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue);
    })();

    return (
        <>
            <Card sx={{
                height: '100%',
                minHeight: 460,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,247,250,0.96))',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
                transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
                position: 'relative',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)',
                    pointerEvents: 'none',
                },
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 22px 44px rgba(15, 23, 42, 0.12)',
                    borderColor: 'rgba(15, 23, 42, 0.12)',
                },
                '&:hover .add-to-cart, &:focus-within .add-to-cart, &:hover .favorite-button, &:focus-within .favorite-button': {
                    opacity: 1,
                    pointerEvents: 'auto',
                },
                '&:hover .add-to-cart, &:focus-within .add-to-cart': {
                    transform: 'translateX(-50%)',
                },
                '@media (hover: none)': {
                    '& .add-to-cart, & .favorite-button': {
                        opacity: 1,
                        pointerEvents: 'auto',
                    },
                    '& .add-to-cart': {
                        transform: 'translateX(-50%)',
                    },
                },
                '@media (max-width: 600px)': {
                    minHeight: 400,
                },
            }}>
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                    <CardMedia
                        component="img"
                        sx={{
                            height: { xs: 260, sm: 320, md: 330 },
                            objectFit: 'contain',
                            background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
                            p: 1,
                            filter: 'drop-shadow(0 24px 20px rgba(15, 23, 42, 0.09))',
                            cursor: 'pointer',
                        }}
                        image={imageUrl}
                        alt={watch.name}
                        onClick={() => setIsPreviewOpen(true)}
                    />

                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        px: 1.25,
                        py: 0.45,
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.83)',
                        border: '1px solid rgba(15,23,42,0.08)',
                        backdropFilter: 'blur(8px)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#374151',
                        textTransform: 'uppercase',
                    }}
                >
                    New
                </Box>

                <IconButton
                    className="favorite-button"
                    aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    aria-pressed={isFavorite}
                    onClick={() => void toggleFavorite(watch, getUser()?._id ?? '')}
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        opacity: 0,
                        pointerEvents: 'none',
                        transition: 'opacity 180ms ease, transform 180ms ease',
                        color: isFavorite ? 'error.main' : '#374151',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'scale(1.03)' },
                    }}
                >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>

                <Button
                    onClick={() => addItem(watch, getUser()?._id)}
                    className="add-to-cart"
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        bottom: 18,
                        left: '50%',
                        transform: 'translateX(-50%) translateY(8px)',
                        opacity: 0,
                        pointerEvents: 'none',
                        transition: 'opacity 180ms ease, transform 180ms ease, box-shadow 180ms ease',
                        whiteSpace: 'nowrap',
                        borderRadius: 999,
                        px: 2.5,
                        py: 1,
                        fontWeight: 700,
                        letterSpacing: '0.03em',
                        textTransform: 'none',
                        boxShadow: '0 16px 28px rgba(17, 24, 39, 0.25)',
                        background: 'linear-gradient(135deg, #0f172a 0%, #111827 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #111827 0%, #0f172a 100%)',
                            boxShadow: '0 18px 30px rgba(17, 24, 39, 0.32)',
                        },
                        '&:focus-visible': {
                            outline: '2px solid rgba(17, 24, 39, 0.18)',
                            outlineOffset: '2px',
                        },
                    }}
                    startIcon={<ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />}
                >
                    Agregar al carrito
                </Button>
            </Box>

            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
                px: { xs: 2, sm: 2.5 },
                pb: { xs: 2, sm: 2.5 },
                pt: 2,
                position: 'relative',
                zIndex: 1,
            }}>
                <Typography
                    gutterBottom
                    component="div"
                    sx={{
                        fontSize: { xs: '1.15rem', md: '1.45rem' },
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: '#111827',
                        letterSpacing: '-0.02em',
                    }}
                >
                    {watch.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.2 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'inline-block',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            fontWeight: 700,
                        }}
                    >
                        {watch.movementType}
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: '#0f172a',
                            fontWeight: 900,
                            letterSpacing: '-0.04em',
                            fontSize: { xs: '0.95rem', md: '1.08rem' },
                            textShadow: '0 1px 0 rgba(255,255,255,0.75)',
                        }}
                    >
                        {formattedPrice}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, minHeight: 0, overflowY: isDescriptionExpanded ? 'auto' : 'hidden' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#4b5563',
                            lineHeight: 1.7,
                            fontSize: { xs: '0.84rem', sm: '0.9rem' },
                        }}
                    >
                        {isLongDescription && !isDescriptionExpanded
                            ? `${descriptionWords.slice(0, 20).join(' ')}...`
                            : watch.description}
                    </Typography>
                </Box>

                {isLongDescription && (
                    <Button
                        sx={{
                            color: '#1f2937',
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            marginTop: '0.5rem',
                            flexShrink: 0,
                            justifyContent: 'flex-start',
                            px: 0,
                            minWidth: 0,
                            fontWeight: 600,
                            '&:hover': { backgroundColor: 'transparent' },
                        }}
                        aria-expanded={isDescriptionExpanded}
                        onClick={() => setIsDescriptionExpanded((expanded) => !expanded)}
                    >
                        {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
                    </Button>
                )}
            </CardContent>
        </Card>

            <Dialog
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                maxWidth="md"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 4,
                            overflow: 'hidden',
                            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                            boxShadow: '0 28px 55px rgba(15, 23, 42, 0.22)',
                        },
                    },
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, pb: 1.5 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                            {watch.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                            {watch.brand}
                        </Typography>
                    </Box>

                    <IconButton
                        aria-label="Cerrar vista previa"
                        onClick={() => setIsPreviewOpen(false)}
                        sx={{
                            backgroundColor: 'rgba(15, 23, 42, 0.04)',
                            '&:hover': { backgroundColor: 'rgba(15, 23, 42, 0.08)' },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: 3, alignItems: 'center' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
                                borderRadius: 3,
                                p: 2,
                                overflow: 'hidden',
                                cursor: 'zoom-in',
                            }}
                            onMouseEnter={() => setIsMagnifierVisible(true)}
                            onMouseLeave={() => setIsMagnifierVisible(false)}
                            onMouseMove={handleMagnifierMove}
                            onWheel={handleMagnifierWheel}
                        >
                                <Box
                                    component="img"
                                    src={imageUrl}
                                    alt={watch.name}
                                    sx={{
                                        width: '100%',
                                        maxHeight: 520,
                                        objectFit: 'contain',
                                        display: 'block',
                                        borderRadius: 2,
                                        filter: 'drop-shadow(0 26px 22px rgba(15, 23, 42, 0.12))',
                                    }}
                                />

                                {isMagnifierVisible && (
                                    <>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 'calc(50% - 110px)',
                                                right: 'calc(50% - 220px)',
                                                px: 1.2,
                                                py: 0.5,
                                                borderRadius: 999,
                                                background: 'rgba(15, 23, 42, 0.8)',
                                                color: '#fff',
                                                fontSize: '0.72rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.08em',
                                                zIndex: 3,
                                                boxShadow: '0 12px 24px rgba(15, 23, 42, 0.18)',
                                            }}
                                        >
                                            {magnifierZoom.toFixed(1)}x
                                        </Box>

                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                width: 180,
                                                height: 180,
                                                borderRadius: '50%',
                                                border: '4px solid rgba(255,255,255,0.9)',
                                                backgroundImage: `url(${imageUrl})`,
                                                backgroundSize: `${magnifierZoom * 100}% ${magnifierZoom * 100}%`,
                                                backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                                                backgroundRepeat: 'no-repeat',
                                                boxShadow: '0 30px 60px rgba(15, 23, 42, 0.22), inset 0 0 0 1px rgba(15,23,42,0.08)',
                                                pointerEvents: 'none',
                                                top: `${magnifierPosition.y}%`,
                                                left: `${magnifierPosition.x}%`,
                                                transform: 'translate(-50%, -50%)',
                                                backdropFilter: 'blur(1px)',
                                            }}
                                        />
                                    </>
                                )}                        </Box>

                        <Stack spacing={2.2}>
                            <Box>
                                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: '0.12em', fontWeight: 700 }}>
                                    Precio
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em' }}>
                                    {formattedPrice}
                                </Typography>
                            </Box>

                            <Divider />

                            <Stack spacing={1.2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                    <Typography sx={{ color: '#6b7280' }}>Stock</Typography>
                                    <Typography sx={{ fontWeight: 700, color: '#111827' }}>{availableStock}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                    <Typography sx={{ color: '#6b7280' }}>Categoría</Typography>
                                    <Typography sx={{ fontWeight: 700, color: '#111827' }}>{watch.category}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                    <Typography sx={{ color: '#6b7280' }}>Movimiento</Typography>
                                    <Typography sx={{ fontWeight: 700, color: '#111827' }}>{watch.movementType}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                    <Typography sx={{ color: '#6b7280' }}>Resistencia</Typography>
                                    <Typography sx={{ fontWeight: 700, color: '#111827' }}>{watch.waterResistance}</Typography>
                                </Box>
                            </Stack>

                            <Divider />

                            <Box>
                                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: '0.12em', fontWeight: 700 }}>
                                    Descripción
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.7, mt: 1 }}>
                                    {watch.description}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
