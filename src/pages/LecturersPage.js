import React, { useState } from 'react';
import { lecturers } from '../data/lecturers';
import LecturerCard from '../components/LecturerCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function LecturersPage() {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useLocalStorage('favorite_lecturers', []);
  
  // состояние для показа только избранных
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Обновляем логику фильтрации
  const filteredLecturers = lecturers.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
    // Если кнопка нажата, показываем только избранных. Если нет - всех.
    const matchesFavorites = showOnlyFavorites ? favorites.includes(l.id) : true;
    
    return matchesSearch && matchesFavorites;
  });

  return (
    <div className="container">
      <h2 className="page-title">Лекторы</h2>
      
      {/* Обновленный блок поиска и кнопки */}
      <div className="search-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Поиск по ФИО..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }} // Поле поиска занимает оставшееся место
        />
        
        {/* НОВАЯ КНОПКА */}
        <button 
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: showOnlyFavorites ? '#e74c3c' : '#f0f0f0', // Красная, если активно
            color: showOnlyFavorites ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
        >
          {showOnlyFavorites ? '❤️ Показать всех' : '🤍 Избранные лекторы'}
        </button>
      </div>

      <div className="lecturers-list">
        {filteredLecturers.length > 0 ? (
          filteredLecturers.map(lecturer => (
            <LecturerCard 
              key={lecturer.id} 
              lecturer={lecturer} 
              isFavorite={favorites.includes(lecturer.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          // Показываем сообщение, если избранных нет
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888', marginTop: '40px' }}>
            {showOnlyFavorites ? 'Вы еще не добавили ни одного лектора в избранное 😔' : 'Лекторы не найдены'}
          </p>
        )}
      </div>
    </div>
  );
}