/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {number} age
 * @property {string} email
 * @property {string} phone
 * @property {string} image
 */
/**
 * @typedef {Object} Post
 * @property {number} id
 * @property {string} title
 * @property {string} body
 * @property {number} views
 */
/**
 * @typedef {Object} Todo
 * @property {number} id
 * @property {string} todo
 * @property {boolean} completed
 */

const API_BASE = "https://dummyjson.com";

function fetchUser(id) {
  $.ajax({
    url: `${API_BASE}/users/${id}`,
    method: "GET",
    success: (user) => renderUser(user),
    error: (error) => console.error("Error fetching user:", error),
  });
}

function fetchPosts(id) {
  $.ajax({
    url: `${API_BASE}/users/${id}/posts`,
    method: "GET",
    success: (data) => renderPosts(data.posts),
    error: (error) => console.error("Error fetching posts:", error),
  });
}

function fetchTodos(id) {
  $.ajax({
    url: `${API_BASE}/users/${id}/todos`,
    method: "GET",
    success: (data) => renderTodos(data.todos),
    error: (error) => console.error("Error fetching todos:", error),
  });
}

function fetchPostDetails(id) {
  $.ajax({
    url: `${API_BASE}/posts/${id}`,
    method: "GET",
    success: (post) => showModal(post),
    error: (error) => console.error("Error fetching post details:", error),
  });
}

/** @param {User} user */
function renderUser(user) {
  const $infoImage = $(".info__image img");
  const $infoContent = $(".info__content");

  $infoImage.attr("src", user.image);
  $infoImage.attr("alt", `${user.firstName} ${user.lastName}`);

  $infoContent.html(`
      <h2>${user.firstName} ${user.lastName}</h2>
      <p><strong>Age:</strong> ${user.age}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
    `);

  const $postsHeader = $(".posts h3");
  $postsHeader.text(`${user.firstName}'s Posts`);

  const $todosHeader = $(".todos h3");
  $todosHeader.text(`${user.firstName}'s To Dos`);
}

/** @param {Post[]} posts */
function renderPosts(posts) {
  const $postsContainer = $(".posts ul");
  $postsContainer.empty();

  if (posts.length === 0) {
    const $li = $("<li>");
    $li.html(`
        <p>User has no posts</p>
      `);
    $postsContainer.append($li);
    return;
  }

  posts.map((post) => {
    const $li = $("<li>");
    $li.html(`
        <h4 data-id="${post.id}">${post.title}</h4>
        <p>${post.body.substring(0, 100)}...</p>
      `);
    $postsContainer.append($li);
  });
}

/** @param {Todo[]} todos */
function renderTodos(todos) {
  const $todosContainer = $(".todos ul");

  $todosContainer.empty();

  if (todos.length === 0) {
    const $li = $("<li>");
    $li.html(`
        <p>User has no todos</p>
      `);
    $todosContainer.append($li);
    return;
  }

  todos.map((todo) => {
    const $li = $("<li>");
    $li.html(`
        <p class="${todo.completed ? "completed" : ""}">${todo.todo}</p>
      `);
    if (todo.completed) {
      $li.css("text-decoration", "line-through");
    }
    $todosContainer.append($li);
  });
}

/** @param {Post} post */
function showModal(post) {
  const $overlay = $('<div class="overlay"></div>');
  const $modal = $('<div class="modal"></div>');

  $modal.html(`
      <h2>${post.title}</h2>
      <p>${post.body}</p>
      <p><strong>Views:</strong> ${post.views}</p>
      <button class="close-modal">Close Modal</button>
    `);

  $overlay.append($modal);
  $("body").append($overlay);

  $(".close-modal").on("click", () => {
    $overlay.remove();
  });
  $overlay.on("click", (e) => {
    if (e.target === this) {
      $(this).remove();
    }
  });
}

function loadUserData(id) {
  fetchUser(id);
  fetchPosts(id);
  fetchTodos(id);
}

$(function () {
  let currentUserId = 1;

  // User buttons
  $("header button:contains('Previous User')").on("click", function () {
    currentUserId--;
    if (currentUserId < 1) currentUserId = 30;
    loadUserData(currentUserId);
  });
  $("header button:contains('Next User')").on("click", function () {
    currentUserId++;
    if (currentUserId > 30) currentUserId = 1;
    loadUserData(currentUserId);
  });

  // (Keyboard arrow keys(additional; I just wanted to add this))
  $(document).keydown(function (e) {
    if (e.key === "ArrowLeft") {
      currentUserId--;
      if (currentUserId < 1) currentUserId = 30;
      loadUserData(currentUserId);
    } else if (e.key === "ArrowRight") {
      currentUserId++;
      if (currentUserId > 30) currentUserId = 1;
      loadUserData(currentUserId);
    }
  });

  // Toggles
  $(".posts h3").on("click", function () {
    $(".posts ul").slideToggle();
  });
  $(".todos h3").on("click", function () {
    $(".todos ul").slideToggle();
  });

  // Post modal
  $(".posts ul").on("click", "h4", function () {
    const postId = $(this).data("id");
    fetchPostDetails(postId);
  });
  // (Close modal with esc key(additional))
  $(document).keydown(function (e) {
    if (e.key === "Escape") {
      $(".overlay").remove();
    }
  });

  loadUserData(currentUserId);
});
