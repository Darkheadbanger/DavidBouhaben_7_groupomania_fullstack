import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
import axios from "axios";
// import post from "../../../Backend/models/post";
let ls = new SecureLS({ isCompression: false });

export default createStore({
  state: {
    user: null, //!localStorage.getItem("userToken")
    users: null,
    post: null,
    posts: null,
    comment: null,
    // addPos : null,
  },
  getters: {
    user: (state) => {
      // Get current value of the user, which in this case user is null
      return state.user;
    },
    users: (state) => {
      // Get current value of the user, which in this case user is null
      return state.users;
    },
    post: (state) => {
      //  get current value of the post
      return state.post;
    },
    posts: (state) => {
      //  get current value of the post
      return state.posts;
    },
    comment: (state) => {
      //  get current value of the comment
      return state.comment;
    },
  },

  plugins: [
    createPersistedState({
      key: "keyname",
      paths: window.localStorage,
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.removeAll(key),
      expires: 1, // 24 heures
    }),
  ],

  actions: {
    login({ commit }, user) {
      const loginAPI = "api/auth/login";
      return new Promise((resolve, reject) => {
        axios
          .post(loginAPI, {
            email: user.email,
            password: user.password,
          })
          .then((response) => {
            localStorage.setItem("userToken", response.data.token);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.token;
            commit("user", response.data.user);
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    signup({ commit }, user) {
      const signUpAPI = "api/auth/signup";
      return new Promise((resolve, reject) => {
        axios
          .post(signUpAPI, {
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            password: user.password,
          })
          .then((response) => {
            commit("user", response.data.accessToken);
            // commit ('user', response.data.user)
            console.log("response", response);

            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    // Creation du post
    createPost({ commit }, post) {
      console.log(post.postContent);
      let formData = new FormData();
      formData.append("image", post.image);
      formData.append("postContent", post.postContent);
      console.log("formData", formData);
      const createPost = "/api/post";
      return new Promise((resolve, reject) => {
        axios
          .post(createPost, formData)
          .then((response) => {
            console.log("createPost");
            commit("addPost", response.data.post);
            console.log(response.data);
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    updatePost({ commit }, post) {
      let formData = new FormData();
      formData.append("image", post.image);
      formData.append("postContent", post.postContent);
      const createUpdatePost = `/api/post/${post.dynamicId}`;
      console.log(createUpdatePost);
      return new Promise((resolve, reject) => {
        axios
          .put(createUpdatePost, formData)
          .then((response) => {
            console.log(response);
            commit("post");
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    // Impression de tous les posts
    getAllPost({ commit }) {
      const getAllPost = "api/post";
      return new Promise((resolve, reject) => {
        axios
          .get(getAllPost)
          .then((response) => {
            console.log("GetAllPost");
            commit("posts", response.data.posts);
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    // impression de mes posts
    getAllMyPost({ commit }, posts) {
      // const userIdDynamic = posts.DynamicId;
      const getAllMyPost = `api/post/${posts.DynamicId}`;
      return new Promise((resolve, reject) => {
        axios
          .get(getAllMyPost)
          .then((response) => {
            console.log(response);
            // posts.thisMyPosts = response.data.myPost;
            console.log("Recuperer mes posts");
            commit("posts", response.data.myPost);
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    deletePost({ commit }, post) {
      const deletePost = `api/post/${post.dynamicId}`;
      console.log("before promise", post.dynamicId);
      return new Promise((resolve, reject) => {
        console.log("after promise");
        axios
          .delete(deletePost)
          .then((response) => {
            console.log("delete reponse");
            commit("deletePost");
            console.log("delete reponse");
            resolve(response);
            console.log("delete reponse");
          })
          .catch((error) => {
            // post
            console.log(error);
            reject(error);
          });
      });
    },
    createComment({ commit }, comment) {
      console.log("this.comment");
      let formData = new FormData();
      formData.append("image", comment.image);
      formData.append("comment", comment.commentaire);
      console.log("formData", formData);
      const createComment = `api/comment/${comment.postId}`;
      return new Promise((resolve, reject) => {
        axios
          .post(createComment, formData)
          .then((response) => {
            console.log("Hey::", response.data.comment);
            commit("addComment", response.data.comment);
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    updateComment({ commit }, comment) {
      let formData = new FormData();
      formData.append("image", comment.image);
      formData.append("comment", comment.commentaire);
      const updateComment = `api/comment/${comment.dynamicId}`;
      console.log(updateComment);
      return new Promise((resolve, reject) => {
        axios
          .put(updateComment, formData)
          .then((response) => {
            console.log(response);
            commit("comment");
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    deleteComment({ commit }, comment) {
      const deleteComment = `api/comment/${comment.dynamicId}`;
      return new Promise((resolve, reject) => {
        axios
          .delete(deleteComment)
          .then((response) => {
            console.log(response);
            commit("commentDelete");
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    // userList n'as pas besoin de le mettre dans vuex

    // page profileInformation, getUserid pas la peine de passer par vuex

    updateUser({ commit }, user) {
      const updateUser = `api/account/me`;
      return new Promise((resolve, reject) => {
        axios
          .patch(updateUser, {
            firstName: user.thisFirstName,
            lastName: user.thisLastName,
            userName: user.thisUserName,
            email: user.thisEmail,
            password: user.thisPassword,
          })
          .then((response) => {
            commit("user", response.data.user);
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    deleteUser({ commit }, user) {
      const confirmDelete = confirm(
        "Êtes vous sûr de vouloir supprimer votre compte ?"
      );
      if (confirmDelete) {
        const deleteUser = `api/account/me/${user.dynamicId}`;
        // const clearToken = localStorage.clear("userToken");
        return new Promise((resolve, reject) => {
          axios
            .delete(deleteUser)
            .then((response) => {
              console.log(response);
              if (response) {
                localStorage.clear("userToken");
                commit("user");
              }
              resolve(response);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        });
      } else {
        localStorage.getItem("userToken");
      }
    },
  },

  mutations: {
    // This is state.user is equal to actions,
    user(state, user) {
      state.user = user; //foncitonne
    },
    users(state, users) {
      state.user = users; //foncitonne
    },
    post(state, post) {
      state.post = post;
    },
    posts(state, posts) {
      state.posts = posts;
      console.log(state.posts);
    },
    comment(state, comment) {
      state.comment = comment;
    },
    addPost(state, post) {
      state.posts.unshift(post);
    },
    addComment(state, comment) {
      // parcourir state.posts (array/tableau de posts) pour trouver celui qui a le même id (postId) que comment.postId
      // rajouter le comment à ce post dans post.comments
      for (let postFind of state.posts) {
        if (postFind.id == comment.postId) {
          postFind.comments.push(comment);
        }
      }
    },
    deletePost(state, post) {
      // Donc, l'action permet à faire une demande axios au backend, si la réponse la réponse est bon alors on efface les données dans le backend
      // quand le bouton effacer se déclanche (appuyer)
      // Ensuite, côté frontend
      // state.posts.slice.(post);
      console.log(post);
      for (let postFind of state.posts) {
        console.log(postFind.id);
        console.log(post);
        if (postFind.id == post.id) {
          // console.log(postFind.id, "==", post.id);
          console.log(postFind.slice(post));
        }
      }
    },
    commentDelete(state, comment) {
      console.log(state, comment);
      for (let postFind of state.posts) {
        console.log(postFind.id);
        if (postFind.id == comment.id) {
          postFind.slice(comment);
        }
      }
    },
  },
});
// Les codes à connaitre sont tous ce qui est parsing du tableau, la condition
