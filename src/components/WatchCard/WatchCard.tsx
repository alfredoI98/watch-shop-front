import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';
import rolex_submariner_blue from "/src/assets/submariner_blue.avif";
import type { Watch } from "../../interfaces/watch";
import { useCartStore } from '../../store/useCartStore';
import { getUser } from '../../services/auth';

export function WatchCard({ watch }: { watch: Watch }) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const descriptionWords = watch.description.trim().split(/\s+/);
    const isLongDescription = descriptionWords.length > 20;
    const addItem = useCartStore((state) => state.addItem);

    return (
        <Card sx={{
            height: 580,
            display: 'flex',
            flexDirection: 'column',
            '&:hover .add-to-cart, &:focus-within .add-to-cart, &:hover .favorite-button, &:focus-within .favorite-button': {
                opacity: 1,
                pointerEvents: 'auto',
            },
            '&:hover .add-to-cart, &:focus-within .add-to-cart': {
                transform: 'translate(-50%, 0)',
            },
            '@media (hover: none)': {
                '& .add-to-cart, & .favorite-button': {
                    opacity: 1,
                    pointerEvents: 'auto',
                },
                '& .add-to-cart': {
                    transform: 'translate(-50%, 0)',
                },
            },
        }}>
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <CardMedia
                    component="img"
                    sx={{ height: 400, objectFit: 'contain' }}
                    image={watch.imagePath ? watch.imagePath : rolex_submariner_blue}
                    alt={watch.name}
                />
                        <IconButton
                            className="favorite-button"
                            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            aria-pressed={isFavorite}
                            onClick={() => setIsFavorite((favorite) => !favorite)}
                            sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                opacity: 0,
                                pointerEvents: 'none',
                                transition: 'opacity 180ms ease',
                                color: isFavorite ? 'error.main' : 'text.secondary',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
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
                                bottom: 16,
                                left: '50%',
                                transform: 'translate(-50%, 8px)',
                                opacity: 0,
                                pointerEvents: 'none',
                                transition: 'opacity 180ms ease, transform 180ms ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Agregar al carrito
                        </Button>
            </Box>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {watch.name}
                </Typography>
                <Box sx={{ flex: 1, minHeight: 0, overflowY: isDescriptionExpanded ? 'auto' : 'hidden' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {isLongDescription && !isDescriptionExpanded
                            ? `${descriptionWords.slice(0, 20).join(' ')}...`
                            : watch.description}
                    </Typography>
                </Box>
                {isLongDescription && (
                    <Button
                        sx={{ color: 'grey', textTransform: 'none', fontSize: '0.875rem', marginTop: '0.5rem', flexShrink: 0 }}
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
