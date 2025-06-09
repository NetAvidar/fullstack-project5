import React, { useState, useEffect } from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import '../css/PostsPage.css'



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
  const [editedComment, setEditedComment] = useState("");
  const user = localStorage.getItem('currentUser') || '';
  const { userId ,postId } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
  // טוען את הפוסטים של המשתמש
fetch(`http://localhost:3005/posts?userId=${userId}`)
    .then(res => res.json())
    .then(data => {
      setPosts(data);

      // אם יש postId בכתובת, בודקים אם הפוסט קיים ומביאים תגובות
      if (postId) {
        const post = data.find(p => p.id === parseInt(postId));
        if (post) {
          console.log("פוסט שנבחר:", post);
          setSelectedPost(post);
          fetchComments(postId);
          setShowComments(true);
        }
      }
    });
  }, [userId, postId]);

  // הוספת פוסט חדש
  const handleAddPost = (e) => {
    e.preventDefault();
    const newPost = {
      title: newPostTitle,
      body: newPostBody,
      userId: userId
    };
fetch('http://localhost:3005/posts', {
        method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(data => {
        setPosts([...posts, data]);
        setNewPostTitle('');
        setNewPostBody('');
      });
  };


  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(search) || String(p.id).includes(search)
  );

  

  const handleDeletePost = (id) => {
  fetch(`http://localhost:3005/posts/${id}`, {
        method: 'DELETE'
    }).then(() => {
      setPosts(posts.filter(p => p.id !== id));
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost(null);
        setComments([]);
      }
    });
  };

  const handleUpdatePost = (id, newTitle, newBody) => {
    const updatedPost = {
      ...selectedPost,
      title: newTitle,
      body: newBody
    };

    fetch(`http://localhost:5000/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    })
      .then(res => res.json())
      .then(data => {
        setPosts(posts.map(p => p.id === id ? data : p));
        if (selectedPost?.id === id) setSelectedPost(data);
      });
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setShowComments(false); // נתחיל בלי תגובות
    fetchComments(post.id); // אם תרצי טעינה מראש
    navigate(`/users/${userId}/posts/${post.id}`);
  };


  const fetchComments = async (postId) => {
  fetch(`http://localhost:5000/comments?postId=${postId}`)
    .then(res => res.json())
    .then(data => setComments(data));
  };

  const handleToggleComments = (post) => {
    if (selectedPost?.id === postId && showComments) {
      // סגירה
      setShowComments(false);
      setSelectedPost(null);
      setComments([]);
      navigate(`/users/${userId}/posts`);
    } else {
      // פתיחה
      setSelectedPost(post);
      fetchComments(postId);
      setShowComments(true);
      navigate(`/users/${userId}/posts/${postId}/comments`);
    }
  };

  const addComment = () => {
    const newCom = {
      postId: postId,
      userId: userId,
      name: user.name,
      body: newComment
    };

fetch('http://localhost:5000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCom)
    })
      .then(res => res.json())
      .then(data => {
        setComments([...comments, data]);
        setNewComment('');
      });
  };

  const deleteComment = (id) => {
fetch(`http://localhost:5000/comments/${id}`, { 
        method: 'DELETE'
    }).then(() => {
      setComments(comments.filter(c => c.id !== id));
    });
  };

  const startEditComment = (id, body) => {
    setEditingCommentId(id);
    setEditedComment(body);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditedComment("");
  };

  const handleSaveComment = (id) => {
    updateComment(id, editedComment);
    cancelEditComment();
  };

  const updateComment = (id, newBody) => {
    const comment = comments.find(c => c.id === id);
    if (!comment) return;

    const updatedComment = { ...comment, body: newBody };

    fetch(`http://localhost:5000/comments/${id}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedComment)
    })
      .then(res => res.json())
      .then(data => {
        setComments(comments.map(c => c.id === id ? data : c));
      });
  };
return (
  <div className="container">
    <h2>Posts של {user.name}</h2>

    <form onSubmit={handleAddPost}>
      <input placeholder="כותרת חדשה" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} required />
      <input placeholder="תוכן הפוסט" value={newPostBody} onChange={(e) => setNewPostBody(e.target.value)} required />
      <button type="submit">➕ הוסף פוסט</button>
    </form>

    <div className="search">
      <input placeholder="🔍 חפש לפי כותרת או ID" value={search} onChange={handleSearch} />
    </div>

    <ul>
      {filteredPosts.map(post => (
        <li key={post.id} style={{ fontWeight: selectedPost?.id === post.id ? 'bold' : 'normal' }}>
          {post.id}: {post.title}
          <div>
            <button onClick={() => handleSelectPost(post)}>בחר</button>
            <button onClick={() => handleDeletePost(post.id)}>🗑</button>
          </div>
        </li>
      ))}
    </ul>

    {selectedPost && (
      <div className="selected-post">
        <h3>פוסט נבחר:</h3>
        <input value={selectedPost.title} onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })} />
        <textarea value={selectedPost.body} onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })} />
        <button onClick={() => handleUpdatePost(selectedPost.id, selectedPost.title, selectedPost.body)}>💾 עדכן</button>

        <hr />
        <button onClick={() => handleToggleComments(selectedPost)}>
          {showComments ? "❌ הסתר תגובות" : "📄 הצג תגובות"}
        </button>

        {showComments && (
          <div className="comments">
            <h4>תגובות:</h4>
            {comments.map(c => (
              <div key={c.id} className="comment">
                <b>{c.name}</b>:&nbsp;
                {editingCommentId === c.id ? (
                  <>
                    <input value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
                    <button onClick={() => handleSaveComment(c.id)}>💾</button>
                    <button onClick={cancelEditComment}>❌</button>
                  </>
                ) : (
                  <>
                    {c.body}
                    {c.userId === user.id && (
                      <>
                        <button onClick={() => startEditComment(c.id, c.body)}>✏</button>
                        <button onClick={() => deleteComment(c.id)}>🗑</button>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
            <input placeholder="תגובה חדשה" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <button onClick={addComment}>➕ הוסף תגובה</button>
          </div>
        )}
      </div>
    )}
  </div>
);
}


export default PostsPage;