// forum.js – Basic forum functionality using localStorage (can be linked to DB later)

document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});

function addPost() {
  const postText = document.getElementById("postText").value.trim();
  if (postText === "") return;

  const posts = JSON.parse(localStorage.getItem("forumPosts")) || [];
  posts.unshift({ text: postText, date: new Date().toLocaleString() });

  localStorage.setItem("forumPosts", JSON.stringify(posts));
  document.getElementById("postText").value = "";
  loadPosts();
}

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("forumPosts")) || [];
  const forumContainer = document.getElementById("forumPosts");
  forumContainer.innerHTML = "";

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "forum-post";
    div.innerHTML = `<p>${post.text}</p><small>${post.date}</small>`;
    forumContainer.appendChild(div);
  });
}
