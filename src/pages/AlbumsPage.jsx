import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/PostsPage.css'

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [visiblePhotos, setVisiblePhotos] = useState(4);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const { userId, albumId } = useParams();
  const navigate = useNavigate();

  const user = localStorage.getItem('currentUser');

  // הבאת האלבומים של המשתמש
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3005/albums?userId=${userId}`)
      .then(res => res.json())
      .then(setAlbums);
  }, [userId]);

  // אם הגענו עם albumId ב-URL, נבחר אותו אוטומטית
  useEffect(() => {
    if (albumId) {
      fetch(`http://localhost:3005/albums/${albumId}`)
        .then(res => res.json())
        .then(album => {
          if (album.id) handleSelectAlbum(album);
        });
    }
  }, [albumId]);

  const filteredAlbums = albums.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    String(a.id).includes(search)
  );

  const handleSelectAlbum = (album) => {
    setSelectedAlbum(album);
    setVisiblePhotos(4);
    navigate(`/users/${userId}/albums/${album.id}/photos`);

    fetch(`http://localhost:3005/photos?albumId=${album.id}`)
      .then(res => res.json())
      .then(setPhotos);
  };

  const handleAddAlbum = () => {
    const newAlbum = {
      userId: user.id,
      title: newAlbumTitle,
    };

    fetch(`http://localhost:3005/albums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlbum),
    })
      .then(res => res.json())
      .then(created => {
        setAlbums([...albums, created]);
        setNewAlbumTitle('');
      });
  };

  const handleAddPhoto = () => {
    const newPhoto = {
      albumId: selectedAlbum.id,
      title: `Photo ${photos.length + 1}`,
      url: newPhotoUrl,
      thumbnailUrl: newPhotoUrl,
    };

    fetch(`http://localhost:3005/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPhoto),
    })
      .then(res => res.json())
      .then(created => {
        setPhotos([...photos, created]);
        setNewPhotoUrl('');
      });
  };

  const handleDeletePhoto = (id) => {
    fetch(`http://localhost:5000/photos/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setPhotos(photos.filter(p => p.id !== id));
    });
  };
  
  const startEditPhoto = (id, title) => {
    setEditingPhotoId(id);
    setEditedTitle(title);
  };

  const cancelEditPhoto = () => {
    setEditingPhotoId(null);
    setEditedTitle("");
  };

  const handleSavePhoto = (id) => {
    handleUpdatePhoto(id, editedTitle);
    cancelEditPhoto();
  };

  const handleUpdatePhoto = (id, newTitle) => {
    const photo = photos.find(p => p.id === id);
    if (!photo) return;

    const updatedPhoto = { ...photo, title: newTitle };

    fetch(`http://localhost:3005/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPhoto)
    })
      .then(res => res.json())
      .then(data => {
        setPhotos(photos.map(p => p.id === id ? data : p));
      });
  };


  return (
    <div>
      <h2>📚 האלבומים של {user?user:''}</h2>

      <input placeholder="🔍 חפש לפי כותרת או ID" value={search} onChange={e => setSearch(e.target.value)}/>

      <form onSubmit={(e) => { e.preventDefault(); handleAddAlbum(); }}>
        <input placeholder="כותרת אלבום חדש" value={newAlbumTitle} onChange={(e) => setNewAlbumTitle(e.target.value)} required/>
        <button type="submit">➕ צור אלבום</button>
      </form>

      <ul>
        {filteredAlbums.map(album => (
          <li key={album.id}>
            <strong>{album.id}</strong>: {album.title}
            <button onClick={() => handleSelectAlbum(album)}>📁 פתח</button>
          </li>
        ))}
      </ul>

      {selectedAlbum && (
        <div style={{ borderTop: '2px solid black', marginTop: 20, paddingTop: 10 }}>
          <h3>📸 {selectedAlbum.title}</h3>

          <form onSubmit={(e) => { e.preventDefault(); handleAddPhoto(); }}>
            <input placeholder="🔗 כתובת תמונה" value={newPhotoUrl} onChange={(e) => setNewPhotoUrl(e.target.value)} required/>
            <button type="submit">➕ הוסף תמונה</button>
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 100px)', gap: 10 }}>
            {photos.slice(0, visiblePhotos).map(photo => (
              <div key={photo.id} style={{ textAlign: 'center' }}>
                <img src={photo.thumbnailUrl} alt={photo.title} width={100} height={100} />

                {editingPhotoId === photo.id ? (
                  <>
                    <input
                      style={{ fontSize: 10, width: '90px' }}
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <div>
                      <button onClick={() => handleSavePhoto(photo.id)}>💾</button>
                      <button onClick={cancelEditPhoto}>❌</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 10 }}>{photo.title}</div>
                    <button onClick={() => handleDeletePhoto(photo.id)}>🗑</button>
                    <button onClick={() => startEditPhoto(photo.id, photo.title)}>✏</button>
                  </>
                )}    
              </div>
            ))}
          </div>


          {visiblePhotos < photos.length && (
            <button onClick={() => setVisiblePhotos(visiblePhotos + 4)}>
              📥 טען עוד תמונות
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AlbumsPage;