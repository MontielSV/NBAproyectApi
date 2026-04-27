import React, { useState, useEffect } from 'react';

const Favoritos = () => {
  const [equipos, setEquipos] = useState([]);
  const [favIds, setFavIds] = useState([]);

  useEffect(() => {
    // 1. Cargamos todos los equipos de la API
    fetch("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams")
      .then(res => res.json())
      .then(data => {
        setEquipos(data.sports[0].leagues[0].teams);
      });

    // 2. Obtenemos los IDs guardados en el Home
    const guardados = JSON.parse(localStorage.getItem("nba_favs")) || [];
    setFavIds(guardados);
  }, []);

  // Función para eliminar de favoritos desde esta página
  const eliminarFavorito = (id) => {
    const nuevosFavs = favIds.filter(favId => favId !== id);
    setFavIds(nuevosFavs);
    localStorage.setItem("nba_favs", JSON.stringify(nuevosFavs));
  };

  // Filtramos los equipos que coincidan con nuestros favoritos
  const misEquiposFavs = equipos.filter(t => favIds.includes(t.team.id));

  return (
    <div className="main-content">
      <h1 style={{ textAlign: 'center', color: '#1d428a' }}>❤️ Mis Equipos Favoritos</h1>
      
      {misEquiposFavs.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>
          Aún no tienes equipos favoritos. ¡Ve al Home y selecciona algunos! 🏀
        </p>
      ) : (
        <div className="teams-grid">
          {misEquiposFavs.map((t) => (
            <div 
              key={t.team.id} 
              className="team-card" 
              style={{ 
                border: `4px solid #${t.team.color}`, // Recuadro del color del equipo
                backgroundColor: `#${t.team.color}10` // Un fondo muy sutil del mismo color (opcional)
              }}
            >
              <img src={t.team.logos[0].href} alt="" className="team-logo" />
              <h3>{t.team.displayName}</h3>
              <p style={{ fontWeight: 'bold', color: `#${t.team.color}` }}>
                {t.team.abbreviation}
              </p>
              
              <div className="btn-container">
                <button 
                  className="btn-main"
                  style={{ backgroundColor: '#ef426f' }} 
                  onClick={() => eliminarFavorito(t.team.id)}
                >
                  QUITAR DE FAVS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;