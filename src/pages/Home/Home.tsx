import { Navbar } from '../../components/Navbar/Navbar';
import './Home.css';
import { WatchCard } from '../../components/WatchCard/WatchCard';
import SimpleParallax from "simple-parallax-js";
import rolex_submariner_black from "../../assets/rolex_submariner_black.avif";
import { Footer } from '../../components/Footer/Footer';
import { Grid } from '@mui/material';
import { useHook } from './useHook';
import { SpinnerLoading } from '../../components/SpinnerLoading/SpinnerLoading';

export function Home() {
  const { isLoading, watches } = useHook();
  
  return (
    isLoading ? <SpinnerLoading /> :
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
          {watches.map((watch) => (
            <Grid key={watch.id} size={3}>
                <WatchCard watch={watch} />
            </Grid>
          ))}
        </Grid>
        <Footer />
      </>
  )
}

