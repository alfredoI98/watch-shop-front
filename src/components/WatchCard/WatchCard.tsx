import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useState } from 'react';
import rolex_submariner_blue from "/src/assets/submariner_blue.avif";
import type { Watch } from "../../interfaces/watch";
import { useCartStore } from '../../store/useCartStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { getUser } from '../../services/auth';

export function WatchCard({ watch }: { watch: Watch }) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const descriptionWords = watch.description.trim().split(/\s+/);
    const isLongDescription = descriptionWords.length > 20;
    const addItem = useCartStore((state) => state.addItem);
    const isFavorite = useFavoritesStore((state) =>
        state.favorites.some((favorite) => favorite._id === watch._id)
    );
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

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
                    }}
                    image={watch.imagePath ? watch.imagePath : rolex_submariner_blue}
                    alt={watch.name}
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
                        Automatic / 38 mm
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
    );
}
