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
          <div className="clouds" aria-hidden="true">
            <span className="cloud cloud-1" />
            <span className="cloud cloud-2" />
            <span className="cloud cloud-3" />
            <span className="cloud cloud-4" />
            <span className="cloud cloud-5" />
          </div>
          <SimpleParallax delay={1.1} scale={1.18} orientation="down" maxTransition={25}>
            <div className="watch-container">
              <div className="watch-visual">
                <img
                  src={rolex_submariner_black}
                  alt={"image"}
                  style={{ maxWidth: '1000px', height: 'auto', display: 'block', margin: '0 auto', position: 'relative', zIndex: 2 }}
                />
              </div>
            </div>
          </SimpleParallax>
        </div>

        <section className="catalog-section">
          <div className="catalog-header">
            <span className="catalog-kicker">Colección</span>
            <h2>Relojes de precisión</h2>
            <p>Descubre piezas elegantes para cada estilo y ocasión.</p>
          </div>

          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            sx={{
              margin: 0,
              width: '100%',
            }}
          >
            {watches.map((watch) => (
              <Grid
                key={watch._id}
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              >
                <WatchCard watch={watch} />
              </Grid>
            ))}
          </Grid>
        </section>

        <Footer />
      </>
  )
}

