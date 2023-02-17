const postsUrl = 'https://jsonplaceholder.typicode.com/posts';
const commentsUrl = 'https://jsonplaceholder.typicode.com/comments';
const postsDiv = document.querySelector('#posts');
const addPostForm = document.querySelector('#add-post-form');

// Получать посты из API
function getPosts() {
  fetch(postsUrl)
    .then(response => response.json())
    .then(posts => {
      posts.forEach(post => {
        const postDiv = createPostElement(post);
        postsDiv.appendChild(postDiv);
        fetch(`${commentsUrl}?postId=${post.id}`)
          .then(response => response.json())
          .then(comments => {
            comments.forEach(comment => {
              const commentDiv = document.createElement('div');
              commentDiv.classList.add('comment');
              const commentName = document.createElement('h3');
              commentName.textContent = comment.name;
              const commentBody = document.createElement('p');
              commentBody.textContent = comment.body;
              commentDiv.appendChild(commentName);
              commentDiv.appendChild(commentBody);
              postDiv.querySelector('.comments').appendChild(commentDiv);
            });
          })
          .catch(error => console.error(error));
      });
    })
    .catch(error => console.error(error));
}


// Добавить пост в API и DOM
function addPost(title, body) {
  const data = { title, body };
  fetch(postsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(post => {
      // Создать пост
      const postDiv = document.createElement('div');
      postDiv.classList.add('post');
      const postTitle = document.createElement('h2');
      postTitle.textContent = post.title;
      const postBody = document.createElement('p');
      postBody.textContent = post.body;
      postDiv.dataset.postId = post.id;
      postDiv.appendChild(postTitle);
      postDiv.appendChild(postBody);
      postsDiv.appendChild(postDiv);
    })
    .catch(error => console.error(error));
}

// Удалить пост из API и DOM
function removePost(postId) {
  fetch(`${postsUrl}/${postId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        // Удалить пост
        const postDiv = document.querySelector(`.post[data-post-id="${postId}"]`);
        postDiv.remove();        
      }
    })
    .catch(error => console.error(error));
}

// Загружать посты при загрузке страницы
getPosts();

function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.classList.add('post');
  postDiv.setAttribute('data-post-id', post.id);
  const postTitle = document.createElement('h2');
  postTitle.textContent = post.title;
  const postBody = document.createElement('p');
  postBody.textContent = post.body;
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-post');
  deleteButton.textContent = 'Delete';
  postDiv.appendChild(postTitle);
  postDiv.appendChild(postBody);
  postDiv.appendChild(deleteButton);
  const commentsDiv = document.createElement('div');
  commentsDiv.classList.add('comments');
  postDiv.appendChild(commentsDiv);
  return postDiv;
}

// Добавить пост при отправке формы
addPostForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = event.target.elements.title.value;
  const body = event.target.elements.body.value;
  addPost(title, body);
  event.target.reset();
});

// Удалить пост при нажатии кнопки удаления 
postsDiv.addEventListener('click', event => {
  if (event.target.classList.contains('delete-post')) {
    const postId = event.target.parentElement.dataset.postId;
    removePost(postId);
  }
});

