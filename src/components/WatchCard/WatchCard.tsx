import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import rolex_submariner_blue from "/src/assets/submariner_blue.avif";

export function WatchCard() {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 400 }}
                image={rolex_submariner_blue}
                title="rolex submariner blue"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Rolex submariner blue
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Rolex submariner blue is a watch that is known for its durability and style. It is a popular choice among watch enthusiasts and collectors.
                </Typography>
            </CardContent>
            <CardActions  sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}
