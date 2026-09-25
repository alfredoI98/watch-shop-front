import { Navbar } from '../../components/Navbar/Navbar';
import './Home.css';
import { WatchCard } from '../../components/WatchCard/WatchCard';
import SimpleParallax from "simple-parallax-js";
import rolex_submariner_black from "../../assets/rolex_submariner_black.avif";
import { Footer } from '../../components/Footer/Footer';
import { Grid, Paper } from '@mui/material';

export function Home() {

  return (
    <>
      <Navbar /> 
      <div className="hero-section">
        <div className="clouds"></div>
        <SimpleParallax delay={1.1} scale={1.5}>
          <div className="watch-container">
            <img
              src={rolex_submariner_black}
              alt={"image"}
              style={{ maxWidth: '1000px', height: 'auto', display: 'block', margin: '0 auto', position: 'relative', zIndex: 2 }}
            />
          </div>
        </SimpleParallax>
      </div>
      <Grid container spacing={2} sx={{ marginTop: '20px', backgroundColor: '#f5f5f5', padding: '20px' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Grid key={i} size={3}>
            <Paper elevation={3} sx={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
              <WatchCard />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Footer />
    </>
  )
}

