import './Footer.css';
export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo Section */}
          <div className="footer-section footer-logo">
            <h3 className="footer-brand">⌚ LUXE WATCH</h3>
            <p className="footer-tagline">Relojes de lujo y precisión</p>
          </div>

          {/* Products */}
          <div className="footer-section">
            <h4 className="footer-title">COLECCIONES</h4>
            <ul className="footer-links">
              <li><a href="#">Submariner</a></li>
              <li><a href="#">Datejust</a></li>
              <li><a href="#">GMT-Master II</a></li>
              <li><a href="#">Day-Date</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-title">SERVICIOS</h4>
            <ul className="footer-links">
              <li><a href="#">Servicio Técnico</a></li>
              <li><a href="#">Mantenimiento</a></li>
              <li><a href="#">Garantía</a></li>
              <li><a href="#">Consultas</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4 className="footer-title">EMPRESA</h4>
            <ul className="footer-links">
              <li><a href="#">Sobre Nosotros</a></li>
              <li><a href="#">Ubicaciones</a></li>
              <li><a href="#">Contacto</a></li>
              <li><a href="#">Carreras</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4 className="footer-title">LEGAL</h4>
            <ul className="footer-links">
              <li><a href="#">Política de Privacidad</a></li>
              <li><a href="#">Términos y Condiciones</a></li>
              <li><a href="#">Política de Cookies</a></li>
              <li><a href="#">Sitemap</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4 className="footer-title">SÍGUENOS</h4>
          <div className="social-links">
            <a href="#" className="social-icon">Facebook</a>
            <a href="#" className="social-icon">Instagram</a>
            <a href="#" className="social-icon">Twitter</a>
            <a href="#" className="social-icon">LinkedIn</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2026 Luxe Watch. Todos los derechos reservados.</p>
          <p className="footer-language">Español | English | Français</p>
        </div>
      </div>
    </footer>
  )
}
