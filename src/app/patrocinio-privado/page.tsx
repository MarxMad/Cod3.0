'use client';

import React from 'react';
import './SponsorshipProposal.css';

const SponsorshipProposal = () => {
  return (
    <>
      <div className="grid-bg" />
      
      <div className="sponsor-container">
        <div className="sponsor-header">
          <div className="logo-container">
            <img src="/CODEB.png" alt="CODEB Logo" className="main-logo" />
          </div>
          <div className="sponsor-logo">&lt;COD3.0&gt;</div>
          <div className="sponsor-subtitle">CODE TRES PUNTO CERO</div>
          <h1>&lt;HACKATHON/&gt;</h1>
          <p className="header-description">El evento de programación más innovador del año</p>
          <p className="header-description">Construye el futuro con código, creatividad y colaboración</p>
        </div>

        <div className="info-box">
          <h2>&lt;ACERCA_DEL_EVENTO/&gt;</h2>
          <p><strong>COD3.0 HACKATHON</strong> es el evento de programación y tecnología más innovador del año, diseñado para reunir a los mejores desarrolladores, diseñadores y emprendedores tecnológicos en un ambiente de creatividad, colaboración e innovación.</p>
          <p><strong>Alcance estimado:</strong> 500+ participantes presenciales | 2,000+ seguidores en streaming | 50,000+ impresiones en redes sociales</p>
          <p><strong>Duración:</strong> 48 horas de programación intensiva</p>
          <p><strong>Público objetivo:</strong> Desarrolladores, estudiantes de tecnología, startups, empresas tech, inversionistas</p>
        </div>

        <h2>&lt;GALERÍA_DEL_EVENTO/&gt;</h2>
        <div className="gallery">
          <div className="gallery-item">
            <img src="/Espectacular.jpeg" alt="Espectacular WTC CDMX" className="gallery-image" />
            <div className="gallery-caption">Espectacular WTC CDMX - 70m x 10m</div>
          </div>
          <div className="gallery-item">
            <img src="/Led.jpeg" alt="Panel LED" className="gallery-image" />
            <div className="gallery-caption">Panel LED - 100cm x 50cm</div>
          </div>
          <div className="gallery-item">
            <img src="/Letra.jpeg" alt="Letra 400K30" className="gallery-image" />
            <div className="gallery-caption">Letra 400K30 - Iluminación LED</div>
          </div>
          <div className="gallery-item">
            <img src="/Stage.jpeg" alt="Stage Principal" className="gallery-image" />
            <div className="gallery-caption">Stage Principal - Evento Exterior</div>
          </div>
          <div className="gallery-item">
            <img src="/Stage2.jpeg" alt="Stage Interior" className="gallery-image" />
            <div className="gallery-caption">Stage Interior - WEB3 HACKATHON</div>
          </div>
        </div>

        <h2>&lt;PAQUETES_DE_PATROCINIO/&gt;</h2>

        <div className="packages">
          <div className="package">
            <div className="package-header">
              <div className="package-title">🏆 PLATINUM</div>
              <div className="package-price">$35,000 USD</div>
            </div>
            <ul className="benefits-list">
              <li>Logo tamaño ESTELAR en escenario principal (3m x 2m)</li>
              <li>Stand PREMIUM (3m x 3m) en zona principal</li>
              <li>Plática magistral (45 min) en horario estelar</li>
              <li>Logo en playeras de todos los participantes (pecho)</li>
              <li>Logo en termos oficiales del evento</li>
              <li>Logo GRANDE en flyers y material impreso</li>
              <li>Mención en inauguración y clausura</li>
              <li>Logo en sitio web (header principal)</li>
              <li>Redes sociales (15 posts destacados)</li>
              <li>Logo en certificados de participación</li>
              <li>10 pases VIP de acceso completo</li>
              <li>Internet dedicado en stand (100 Mbps)</li>
              <li>Naming rights de categoría o premio</li>
            </ul>
          </div>

          <div className="package">
            <div className="package-header">
              <div className="package-title">🥈 SILVER</div>
              <div className="package-price">$12,000 USD</div>
            </div>
            <ul className="benefits-list">
              <li>Logo GRANDE en escenario (2m x 1.5m)</li>
              <li>Stand estándar (2m x 2m) en zona principal</li>
              <li>Workshop técnico (30 min)</li>
              <li>Logo en playeras (manga derecha)</li>
              <li>Logo MEDIANO en flyers</li>
              <li>Logo destacado en sitio web</li>
              <li>Redes sociales (10 posts)</li>
              <li>Logo en pantallas durante el evento</li>
              <li>6 pases de acceso completo</li>
              <li>Internet compartido en stand (50 Mbps)</li>
              <li>Mención en ceremonia de premiación</li>
            </ul>
          </div>

          <div className="package">
            <div className="package-header">
              <div className="package-title">🥉 BRONZE</div>
              <div className="package-price">$6,000 USD</div>
            </div>
            <ul className="benefits-list">
              <li>Logo MEDIANO en escenario (1.5m x 1m)</li>
              <li>Stand básico (2m x 1.5m)</li>
              <li>Logo en playeras (manga izquierda)</li>
              <li>Logo en flyers</li>
              <li>Logo en sitio web (sección patrocinadores)</li>
              <li>Redes sociales (5 posts)</li>
              <li>Logo en pantallas rotativas</li>
              <li>4 pases de acceso completo</li>
              <li>Internet compartido básico</li>
            </ul>
          </div>
        </div>

        <h2>&lt;DESGLOSE_DETALLADO_DE_BENEFICIOS/&gt;</h2>

        <h3>&gt; PRESENCIA EN ESCENARIO</h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>Tamaño/Ubicación</th>
              <th>Dimensiones</th>
              <th>Visibilidad</th>
              <th>Valor Individual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Logo ESTELAR (Platinum)</td>
              <td>3m x 2m</td>
              <td>Posición central, máxima exposición</td>
              <td>$10,500 USD</td>
            </tr>
            <tr>
              <td>Logo GRANDE (Silver)</td>
              <td>2m x 1.5m</td>
              <td>Posición lateral destacada</td>
              <td>$3,600 USD</td>
            </tr>
            <tr>
              <td>Logo MEDIANO (Bronze)</td>
              <td>1.5m x 1m</td>
              <td>Panel lateral</td>
              <td>$1,800 USD</td>
            </tr>
          </tbody>
        </table>

        <h3>&gt; STANDS Y ESPACIOS FÍSICOS</h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>Tipo de Stand</th>
              <th>Dimensiones</th>
              <th>Incluye</th>
              <th>Valor Individual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stand PREMIUM</td>
              <td>3m x 3m</td>
              <td>Mobiliario, iluminación, electricidad, internet dedicado</td>
              <td>$10,500 USD</td>
            </tr>
            <tr>
              <td>Stand ESTÁNDAR</td>
              <td>2m x 2m</td>
              <td>Mesa, sillas, electricidad, internet compartido</td>
              <td>$3,600 USD</td>
            </tr>
            <tr>
              <td>Stand BÁSICO</td>
              <td>2m x 1.5m</td>
              <td>Mesa, sillas, electricidad</td>
              <td>$1,800 USD</td>
            </tr>
          </tbody>
        </table>

        <h3>&gt; PLÁTICAS Y WORKSHOPS</h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>Tipo de Participación</th>
              <th>Duración</th>
              <th>Horario</th>
              <th>Valor Individual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Plática Magistral ESTELAR</td>
              <td>45 minutos</td>
              <td>Horario prime (inauguración/clausura)</td>
              <td>$10,500 USD</td>
            </tr>
            <tr>
              <td>Workshop Técnico</td>
              <td>30 minutos</td>
              <td>Horario regular</td>
              <td>$3,600 USD</td>
            </tr>
            <tr>
              <td>Charla Lightning</td>
              <td>15 minutos</td>
              <td>Entre eventos</td>
              <td>$1,800 USD</td>
            </tr>
          </tbody>
        </table>

        <h3>&gt; MERCHANDISING Y MATERIAL IMPRESO</h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Cantidad</th>
              <th>Ubicación Logo</th>
              <th>Valor Individual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Playeras (Logo pecho)</td>
              <td>500 unidades</td>
              <td>Pecho, 15cm x 10cm</td>
              <td>$10,500 USD</td>
            </tr>
            <tr>
              <td>Playeras (Logo manga)</td>
              <td>500 unidades</td>
              <td>Manga, 8cm x 6cm</td>
              <td>$3,600 USD</td>
            </tr>
            <tr>
              <td>Termos personalizados</td>
              <td>500 unidades</td>
              <td>Estampado 360°</td>
              <td>$8,400 USD</td>
            </tr>
            <tr>
              <td>Flyers (Logo grande)</td>
              <td>2,000 unidades</td>
              <td>Portada/contraportada</td>
              <td>$3,360 USD</td>
            </tr>
            <tr>
              <td>Flyers (Logo mediano)</td>
              <td>2,000 unidades</td>
              <td>Interior destacado</td>
              <td>$2,100 USD</td>
            </tr>
            <tr>
              <td>Flyers (Logo pequeño)</td>
              <td>2,000 unidades</td>
              <td>Sección patrocinadores</td>
              <td>$1,260 USD</td>
            </tr>
            <tr>
              <td>Gafetes/Credenciales</td>
              <td>500 unidades</td>
              <td>Reverso</td>
              <td>$1,680 USD</td>
            </tr>
            <tr>
              <td>Certificados</td>
              <td>500 unidades</td>
              <td>Pie de página</td>
              <td>$1,260 USD</td>
            </tr>
            <tr>
              <td>Stickers oficiales</td>
              <td>1,000 unidades</td>
              <td>Logo completo</td>
              <td>$1,050 USD</td>
            </tr>
          </tbody>
        </table>

        <h3>&gt; PRESENCIA DIGITAL</h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>Canal/Ubicación</th>
              <th>Especificaciones</th>
              <th>Alcance Estimado</th>
              <th>Valor Individual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sitio Web (Header principal)</td>
              <td>Logo prominente en home</td>
              <td>10,000+ visitas</td>
              <td>$3,360 USD</td>
            </tr>
            <tr>
              <td>Sitio Web (Destacado)</td>
              <td>Sección patrocinadores premium</td>
              <td>10,000+ visitas</td>
              <td>$2,100 USD</td>
            </tr>
            <tr>
              <td>Sitio Web (Estándar)</td>
              <td>Lista de patrocinadores</td>
              <td>10,000+ visitas</td>
              <td>$1,050 USD</td>
            </tr>
            <tr>
              <td>Redes Sociales (15 posts)</td>
              <td>Instagram, Twitter, LinkedIn, Facebook</td>
              <td>50,000+ impresiones</td>
              <td>$6,300 USD</td>
            </tr>
            <tr>
              <td>Redes Sociales (10 posts)</td>
              <td>Instagram, Twitter, LinkedIn, Facebook</td>
              <td>35,000+ impresiones</td>
              <td>$4,200 USD</td>
            </tr>
            <tr>
              <td>Redes Sociales (5 posts)</td>
              <td>Instagram, Twitter, LinkedIn, Facebook</td>
              <td>20,000+ impresiones</td>
              <td>$2,100 USD</td>
            </tr>
            <tr>
              <td>Pantallas durante evento</td>
              <td>Rotación cada 5 minutos (48h)</td>
              <td>500+ asistentes presenciales</td>
              <td>$2,520 USD</td>
            </tr>
            <tr>
              <td>Stream oficial (logo overlay)</td>
              <td>Logo permanente en transmisión</td>
              <td>2,000+ espectadores online</td>
              <td>$4,200 USD</td>
            </tr>
          </tbody>
        </table>

        <h3>&gt; SERVICIOS TÉCNICOS</h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Especificaciones</th>
              <th>Valor Individual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Internet Dedicado (100 Mbps)</td>
              <td>Conexión exclusiva, IP fija, soporte 24/7</td>
              <td>$3,360 USD</td>
            </tr>
            <tr>
              <td>Internet Compartido (50 Mbps)</td>
              <td>Conexión compartida con otros stands</td>
              <td>$1,260 USD</td>
            </tr>
            <tr>
              <td>Internet Básico</td>
              <td>Acceso WiFi general del evento</td>
              <td>$420 USD</td>
            </tr>
            <tr>
              <td>Electricidad (toma dedicada)</td>
              <td>20 amperes, circuito exclusivo</td>
              <td>$1,050 USD</td>
            </tr>
          </tbody>
        </table>

        <h3>&gt; ACCESOS Y PRIVILEGIOS</h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>Tipo de Pase</th>
              <th>Beneficios</th>
              <th>Valor Unitario</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pase VIP</td>
              <td>Acceso completo, zona VIP, comidas, networking exclusivo</td>
              <td>$1,470 USD</td>
            </tr>
            <tr>
              <td>Pase Completo</td>
              <td>Acceso a todas las áreas, comidas incluidas</td>
              <td>$840 USD</td>
            </tr>
            <tr>
              <td>Pase Básico</td>
              <td>Acceso general al evento</td>
              <td>$504 USD</td>
            </tr>
          </tbody>
        </table>

        <h3>&gt; BENEFICIOS ESPECIALES</h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>Beneficio</th>
              <th>Descripción</th>
              <th>Valor Individual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Naming Rights</td>
              <td>Patrocinio titular de categoría o premio principal</td>
              <td>$10,500 USD</td>
            </tr>
            <tr>
              <td>Mención Inauguración/Clausura</td>
              <td>Reconocimiento verbal en ceremonias principales</td>
              <td>$3,360 USD</td>
            </tr>
            <tr>
              <td>Mención Premiación</td>
              <td>Reconocimiento en entrega de premios</td>
              <td>$2,100 USD</td>
            </tr>
            <tr>
              <td>Base de datos participantes</td>
              <td>Contactos de asistentes (con consentimiento)</td>
              <td>$2,940 USD</td>
            </tr>
          </tbody>
        </table>

        <div className="info-box">
          <h2>&lt;BENEFICIOS_ADICIONALES/&gt;</h2>
          <h3>&gt; CAMPAÑA MASIVA DE MARKETING</h3>
          <p>Todos los patrocinadores se benefician de nuestra campaña integral de marketing que incluye:</p>
          <ul className="benefits-list">
            <li><strong>Email Marketing:</strong> 3 newsletters a base de datos de 5,000+ contactos tech</li>
            <li><strong>Publicidad Digital:</strong> Campañas en Google Ads, Facebook Ads, LinkedIn Ads</li>
            <li><strong>Influencers Tech:</strong> Colaboraciones con creadores de contenido tecnológico</li>
            <li><strong>Medios Especializados:</strong> Notas de prensa en portales tech y blogs</li>
            <li><strong>Radio y Podcasts:</strong> Menciones en programas de tecnología</li>
            <li><strong>Universidad Partners:</strong> Difusión en 15+ universidades</li>
            <li><strong>Comunidades Dev:</strong> Promoción en grupos de Facebook, Discord, Slack</li>
          </ul>
          <p><strong>Inversión total en marketing:</strong> $48,000+ USD | <strong>Alcance proyectado:</strong> 100,000+ personas</p>
        </div>

        <h2>&lt;COMPARATIVA_DE_PAQUETES/&gt;</h2>
        <div style={{overflowX: 'auto'}}>
          <table className="detail-table">
            <thead>
              <tr>
                <th>Beneficio</th>
                <th>PLATINUM</th>
                <th>SILVER</th>
                <th>BRONZE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Inversión</td>
                <td>$35,000</td>
                <td>$12,000</td>
                <td>$6,000</td>
              </tr>
              <tr>
                <td>Logo en Escenario</td>
                <td>ESTELAR (3x2m)</td>
                <td>GRANDE (2x1.5m)</td>
                <td>MEDIANO (1.5x1m)</td>
              </tr>
              <tr>
                <td>Stand</td>
                <td>PREMIUM 3x3m</td>
                <td>ESTÁNDAR 2x2m</td>
                <td>BÁSICO 2x1.5m</td>
              </tr>
              <tr>
                <td>Plática/Workshop</td>
                <td>45 min estelar</td>
                <td>30 min</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Logo en Playeras</td>
                <td>Pecho</td>
                <td>Manga der.</td>
                <td>Manga izq.</td>
              </tr>
              <tr>
                <td>Logo en Termos</td>
                <td>✓</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Posts en RRSS</td>
                <td>15 posts</td>
                <td>10 posts</td>
                <td>5 posts</td>
              </tr>
              <tr>
                <td>Internet</td>
                <td>Dedicado 100Mbps</td>
                <td>Compartido 50Mbps</td>
                <td>Básico</td>
              </tr>
              <tr>
                <td>Pases incluidos</td>
                <td>10 VIP</td>
                <td>6 completos</td>
                <td>4 completos</td>
              </tr>
              <tr>
                <td>Naming Rights</td>
                <td>✓</td>
                <td>—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="info-box">
          <h2>&lt;VALOR_TOTAL_DE_BENEFICIOS/&gt;</h2>
          <table className="detail-table">
            <thead>
              <tr>
                <th>Paquete</th>
                <th>Inversión</th>
                <th>Valor Total Beneficios</th>
                <th>Ahorro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>PLATINUM</strong></td>
                <td>$35,000 USD</td>
                <td>$67,200+ USD</td>
                <td>48% de ahorro</td>
              </tr>
              <tr>
                <td><strong>SILVER</strong></td>
                <td>$12,000 USD</td>
                <td>$28,800+ USD</td>
                <td>58% de ahorro</td>
              </tr>
              <tr>
                <td><strong>BRONZE</strong></td>
                <td>$6,000 USD</td>
                <td>$14,400+ USD</td>
                <td>58% de ahorro</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="footer">
          <h2>&lt;CONTACTO/&gt;</h2>
          <p>Para más información o para personalizar tu paquete de patrocinio:</p>
          <div style={{marginTop: '20px'}}>
            <a href="mailto:hola@code3mx.com" className="cta-button">ENVIAR EMAIL</a>
          </div>
          <p style={{marginTop: '30px', opacity: 0.7}}>
            COD3.0 HACKATHON © 2026 | Construyendo el futuro con código
          </p>
        </div>
      </div>
    </>
  );
};

export default SponsorshipProposal;
