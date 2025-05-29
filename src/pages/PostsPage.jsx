import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  state = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return <h3 style={{ color: 'red' }}>שגיאה: {this.state.errorMessage}</h3>;
    }
    return this.props.children;
  }
}

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('currentUser')) || null;
  const { userId, postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError('משתמש לא מחובר. אנא התחבר מחדש.');
      return;
    }

    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3001/posts?userId=${userId}`);
        if (!res.ok) {
          throw new Error('שגיאה בטעינת הפוסטים');
        }
        const data = await res.json();
        setPosts(data);

        if (postId) {
          const post = data.find(p => p.id === parseInt(postId));
          if (post) {
            setSelectedPost(post);
            await fetchComments(postId);
            setShowComments(true);
          } else {
            setError('הפוסט לא נמצא');
          }
        }
      } catch (err) {
        setError('שגיאה בטעינת הפוסטים: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [userId, postId, user]);

  const fetchComments = async (postId) => {
    try {
      const res = await fetch(`http://localhost:3001/comments?postId=${postId}`);
      if (!res.ok) {
        throw new Error('שגיאה בטעינת התגובות');
      }
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError('שגיאה בטעינת התגובות: ' + err.message);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const newPost = {
        title: newPostTitle,
        body: newPostBody,
        userId: parseInt(userId),
      };
      const res = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) {
        throw new Error('שגיאה בהוספת הפוסט');
      }
      const data = await res.json();
      setPosts([...posts, data]);
      setNewPostTitle('');
      setNewPostBody('');
    } catch (err) {
      setError('שגיאה בהוספת הפוסט: ' + err.message);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredPosts = posts.filter(
    (p) => p.title.toLowerCase().includes(search) || String(p.id).includes(search)
  );

  const handleDeletePost = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/posts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('שגיאה במחיקת הפוסט');
      }
      setPosts(posts.filter((p) => p.id !== id));
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost(null);
        setComments([]);
        navigate(`/users/${userId}/posts`);
      }
    } catch (err) {
      setError('שגיאה במחיקת הפוסט: ' + err.message);
    }
  };

  const handleUpdatePost = async (id, newTitle, newBody) => {
    try {
      const updatedPost = {
        ...selectedPost,
        title: newTitle,
        body: newBody,
      };
      const res = await fetch(`http://localhost:3001/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost),
      });
      if (!res.ok) {
        throw new Error('שגיאה בעדכון הפוסט');
      }
      const data = await res.json();
      setPosts(posts.map((p) => (p.id === id ? data : p)));
      if (selectedPost?.id === id) setSelectedPost(data);
    } catch (err) {
      setError('שגיאה בעדכון הפוסט: ' + err.message);
    }
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setShowComments(false);
    fetchComments(post.id);
    navigate(`/users/${userId}/posts/${post.id}`);
  };

  const handleToggleComments = (post) => {
    if (selectedPost?.id === post.id && showComments) {
      setShowComments(false);
      setSelectedPost(null);
      setComments([]);
      navigate(`/users/${userId}/posts`);
    } else {
      setSelectedPost(post);
      fetchComments(post.id);
      setShowComments(true);
      navigate(`/users/${userId}/posts/${post.id}`);
    }
  };

  const addComment = async () => {
    try {
      const newCom = {
        postId: parseInt(postId),
        userId: parseInt(userId),
        name: user.name,
        body: newComment,
      };
      const res = await fetch('http://localhost:3001/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCom),
      });
      if (!res.ok) {
        throw new Error('שגיאה בהוספת התגובה');
      }
      const data = await res.json();
      setComments([...comments, data]);
      setNewComment('');
    } catch (err) {
      setError('שגיאה בהוספת התגובה: ' + err.message);
    }
  };

  const deleteComment = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/comments/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('שגיאה במחיקת התגובה');
      }
      setComments(comments.filter((c) => c.id !== id));
    } catch (err) {
      setError('שגיאה במחיקת התגובה: ' + err.message);
    }
  };

  const startEditComment = (id, body) => {
    setEditingCommentId(id);
    setEditedComment(body);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditedComment('');
  };

  const handleSaveComment = (id) => {
    updateComment(id, editedComment);
    cancelEditComment();
  };

  const updateComment = async (id, newBody) => {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    try {
      const updatedComment = { ...comment, body: newBody };
      const res = await fetch(`http://localhost:3001/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedComment),
      });
      if (!res.ok) {
        throw new Error('שגיאה בעדכון התגובה');
      }
      const data = await res.json();
      setComments(comments.map((c) => (c.id === id ? data : c)));
    } catch (err) {
      setError('שגיאה בעדכון התגובה: ' + err.message);
    }
  };

  if (!user) {
    return <div style={{ color: 'red' }}>שגיאה: משתמש לא מחובר. אנא התחבר מחדש.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {loading && <div>טוען...</div>}
        <h2>פוסטים של {user.name}</h2>

        <form onSubmit={handleAddPost}>
          <input
            placeholder="כותרת חדשה"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            required
          />
          <input
            placeholder="תוכן הפוסט"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
            required
          />
          <button type="submit">➕ הוסף פוסט</button>
        </form>

        <input
          placeholder="🔍 חפש לפי כותרת או ID"
          value={search}
          onChange={handleSearch}
        />

        <ul>
          {filteredPosts.map((post) => (
            <li
              key={post.id}
              style={{ fontWeight: selectedPost?.id === post.id ? 'bold' : 'normal' }}
            >
              {post.id}: {post.title}
              <button onClick={() => handleSelectPost(post)}>בחר</button>
              <button onClick={() => handleDeletePost(post.id)}>🗑️</button>
            </li>
          ))}
        </ul>

        {selectedPost && (
          <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
            <h3>פוסט נבחר:</h3>
            <input
              value={selectedPost.title}
              onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
            />
            <textarea
              value={selectedPost.body}
              onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
            />
            <button
              onClick={() => handleUpdatePost(selectedPost.id, selectedPost.title, selectedPost.body)}
            >
              💾 עדכן
            </button>

            <hr />
            <button onClick={() => handleToggleComments(selectedPost)}>
              {showComments ? '❌ הסתר תגובות' : '📄 הצג תגובות'}
            </button>

            {showComments && (
              <div>
                <h4>תגובות:</h4>
                {comments.map((c) => (
                  <div key={c.id} style={{ borderBottom: '1px solid gray', marginBottom: '10px' }}>
                    <b>{c.name}</b>:&nbsp;
                    {editingCommentId === c.id ? (
                      <>
                        <input
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                        />
                        <button onClick={() => handleSaveComment(c.id)}>💾</button>
                        <button onClick={cancelEditComment}>❌</button>
                      </>
                    ) : (
                      <>
                        {c.body}
                        {c.userId === user.id && (
                          <>
                            <button onClick={() => startEditComment(c.id, c.body)}>✏️</button>
                            <button onClick={() => deleteComment(c.id)}>🗑️</button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <input
                  placeholder="תגובה חדשה"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={addComment}>➕ הוסף תגובה</button>
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default PostsPage;