// load the resources from the api on loading of webpage
// const fetchAPI = document.getElementById('fetchAPI');
window.addEventListener("load", fetchAPIfunction);

//function to fetch the API resources
function fetchAPIfunction() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("body").value = "";


  fetch("https://emmi-softwaretrack.online/api/blogs")
    .then((res) => {
      if (!res.ok) throw new Error(`the HTTP error is ${res.status}`);

      return res.json();
    })
    .then((data) => {
         // inside the ul i removed the post id of <li><small>${blog.id}  </small> </li>
         // Delete Post ${blog.title}
      let output = "";
      data.data.forEach((blog) => {
        output += `
            <div class="col-md-6 p-1">
            <div class="card p-3">
            <ul style='list-style-type:none'>
                
                <li>
                    <h2> ${blog.title}  </h2> 
                </li>
                <li>
                    <h5 class="author"> Author: ${blog.author}  </h5> 
                </li>
                <li>
                    <h5 class="publish">Date of Publishing: ${new Date(blog.created_at).toLocaleString('en', {
                            timeZoneName: 'short',})
                    }</h5> 
                </li>
                
                <li><p> ${blog.body}   <p> </li>
            </ul>
                <button class="btn btn-outline-secondary btn-primary updatePost" id="updatePost" style="color: white;" data-id="${
                  blog.id
                }" >
                            Update Post 
                </button> 
                <button class="btn btn-danger mt-2 deletePost" id="deletePost" data-id="${
                  blog.id
                }">
                    Delete Post
                </button>

            
            </div>
            </div>
            
            `;
        document.getElementById("output").innerHTML = output;
        window.localStorage.setItem("data", JSON.stringify(data.data));
        waitLoadUpdate();
        waitLoad();
      });
    })
    .catch((err) => console.error(err.message));
}

//Add Blog Post Starts

const addPost = document.getElementById("addPost");
addPost.addEventListener("submit", addBlogPost);

function addBlogPost(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const body = document.getElementById("body").value;
  const url = "https://emmi-softwaretrack.online/api/blogs";
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      author: author,
      body: body,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      alert(res.message);
      setTimeout(fetchAPIfunction, 100);
    });
}

//update part
function waitLoadUpdate() {
  //newData is the array of objects from our server that was previously cached/stored using local storage
  function searchStorage(postID, newData) {
    // console.log(newData.length + ' and the postID is ' + postID)
    for (i = 0; i < newData.length; i++) {
      // console.log(newData[i])
      if (newData[i].id == postID) {
        // console.log(newData[i])

        document.getElementById("updateId").value = postID;
        document.getElementById("updateTitle").value = newData[i].title;
        document.getElementById("updateBody").value = newData[i].body;
        showPopup();

        break;
      }
    }
  }

  function showPopup() {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("updateModal").style.display = "block";
    document.getElementById("updateModal").classList.add("show");
  }

  const updateButton = document.querySelectorAll(".updatePost");
  updateButton.forEach((button) => {
    button.addEventListener("click", () => {
      let postID = button.dataset.id;
      // console.log(postID);
      let newData = JSON.parse(localStorage.getItem("data"));
      searchStorage(postID, newData); //this searchstorage fxn helps us to access the entire API GET request and search for individual posts
    });
  });
}

const updateBlog = document.getElementById("updatePostForm");
updateBlog.addEventListener("submit", updateBlogPost);

function updateBlogPost(e) {
  e.preventDefault(); //prevent the element from acting naturally in its default behaviour

  const id = document.getElementById("updateId").value;
  const title = document.getElementById("updateTitle").value;
  const body = document.getElementById("updateBody").value;
  const url = `https://emmi-softwaretrack.online/api/update-blog/${id}`;
  fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      body: body,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      closePopup();
      alert(data.message);
      setTimeout(fetchAPIfunction, 100);
    });
}

//delete button part
function waitLoad() {
  const deletePost = document.querySelectorAll(".deletePost");
  // console.log(deletePost);
  deletePost.forEach((button) => {
    button.addEventListener("click", () => {
      let id = button.dataset.id;
      let text = `Do you want to Delete Post ${id}`;
      if (confirm(text) == true) {
        deleteBlogPost(id);
      } else {
        fetchAPIfunction();
      }
    });
  });
}

function deleteBlogPost(id) {
  const url = `https://emmi-softwaretrack.online/api/delete-blog/${id}`;
  fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      sweetAlert(data.message);
      setTimeout(fetchAPIfunction, 100);
    });
}

//for alerts
function sweetAlert(msg) {
  document.getElementById("alert").innerHTML = `
<div class="alert alert-warning alert-dismissible fade show" role="alert">
${msg}
<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
    `;
}
