import React, { useState, useEffect } from 'react';

const Home = () => {
  const [equipos, setEquipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [favs, setFavs] = useState([]);
  
  // Nuevo Estado para el Filtro de Famosos
  const [soloFamosos, setSoloFamosos] = useState(false);

  // Estados para el Modal y Plantilla
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [plantilla, setPlantilla] = useState([]);
  const [cargandoPlantilla, setCargandoPlantilla] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // IDs de los 8 equipos más famosos según la API de ESPN
  // 13: Lakers, 4: Bulls, 9: Warriors, 2: Celtics, 20: 76ers, 10: Rockets, 14: Heat, 17: Knicks
  const idsFamosos = ["13", "4", "9", "2", "20", "10", "14", "17"];

  useEffect(() => {
    fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams")
      .then(res => res.json())
      .then(data => setEquipos(data.sports[0].leagues[0].teams));

    const guardados = JSON.parse(localStorage.getItem("nba_favs")) || [];
    setFavs(guardados);
  }, []);

  const alternarFavorito = (id) => {
    const nuevosFavs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    setFavs(nuevosFavs);
    localStorage.setItem("nba_favs", JSON.stringify(nuevosFavs));
  };

  const abrirPlantilla = (equipo) => {
    setEquipoSeleccionado(equipo);
    setMostrarModal(true);
    setCargandoPlantilla(true);
    setPlantilla([]);

    fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${equipo.id}/roster`)
      .then(res => res.json())
      .then(data => {
        setPlantilla(data.athletes);
        setCargandoPlantilla(false);
      })
      .catch(() => setCargandoPlantilla(false));
  };

  // LÓGICA DE FILTRADO COMBINADA (Buscador + Famosos)
  const equiposFiltrados = equipos.filter(item => {
    const cumpleBusqueda = item.team.displayName.toLowerCase().includes(busqueda.toLowerCase());
    const esFamoso = soloFamosos ? idsFamosos.includes(item.team.id) : true;
    return cumpleBusqueda && esFamoso;
  });

  return (
    <div className="main-content">
      <h1 style={{ textAlign: 'center', color: '#1d428a', textTransform: 'uppercase', letterSpacing: '2px' }}>
        NBA EQUIPOS
      </h1>

      {/* Contenedor de Buscador y Filtro */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '15px', 
        marginBottom: '40px',
        maxWidth: '800px',
        margin: '0 auto 40px'
      }}>
        <input 
          type="text" 
          className="search-input"
          style={{ margin: 0, flex: 1 }}
          placeholder="Buscar equipo..." 
          onChange={(e) => setBusqueda(e.target.value)}
        />
        
        {/* Botón de Filtro "Los 8 Grandes" */}
        <button 
          onClick={() => setSoloFamosos(!soloFamosos)}
          style={{
            padding: '12px 20px',
            borderRadius: '25px',
            border: '2px solid #1d428a',
            backgroundColor: soloFamosos ? '#1d428a' : 'white',
            color: soloFamosos ? 'white' : '#1d428a',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: '0.3s',
            whiteSpace: 'nowrap'
          }}
        >
          {soloFamosos ? '✨ Ver Todos' : '🏆 Los 8 Grandes'}
        </button>
      </div>

      <div className="teams-grid">
        {equiposFiltrados.map((t) => {
          const esFav = favs.includes(t.team.id);
          return (
            <div key={t.team.id} className="team-card">
              <img src={t.team.logos[0].href} alt="" className="team-logo" />
              <h3 style={{ margin: '10px 0' }}>{t.team.displayName}</h3>
              <div className="btn-container">
                <button 
                  className="btn-main"
                  style={{ backgroundColor: `#${t.team.color}` }}
                  onClick={() => abrirPlantilla(t.team)}
                >
                  VER PLANTILLA
                </button>
                <button 
                  className="btn-fav"
                  onClick={() => alternarFavorito(t.team.id)}
                  style={{ color: esFav ? '#ef426f' : '#ccc' }}
                >
                  {esFav ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE PLANTILLA */}
      {mostrarModal && equipoSeleccionado && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} 
               style={{ borderTop: `10px solid #${equipoSeleccionado.color}`, maxWidth: '600px' }}>
            <button className="close-btn" onClick={() => setMostrarModal(false)}>×</button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <img src={equipoSeleccionado.logos[0].href} alt="" width="80" />
                <h2 style={{ margin: 0 }}>{equipoSeleccionado.displayName}</h2>
            </div>
            <h3 style={{ marginTop: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Roster Oficial</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '10px' }}>
              {cargandoPlantilla ? (
                <p>Cargando jugadores...</p>
              ) : (
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                      <th style={{ padding: '10px' }}>Nombre</th>
                      <th style={{ padding: '10px' }}>Posición</th>
                      <th style={{ padding: '10px' }}>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plantilla.map(jugador => (
                      <tr key={jugador.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{jugador.fullName}</td>
                        <td style={{ padding: '10px', color: '#666' }}>{jugador.position?.abbreviation || 'N/A'}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{jugador.jersey || '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;