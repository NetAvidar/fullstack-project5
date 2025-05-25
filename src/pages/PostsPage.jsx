import React, {useEffect} from "react";


function PostsPage() {

  useEffect(() => {
    fetch('http://localhost:3005/posts/1')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>Posts Page</h1>
    </div>
  );
}
export default PostsPage;
