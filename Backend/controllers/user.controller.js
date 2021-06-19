const db = require("../models");
const fs = require("fs");

const Comment = db.comment;
const User = db.user;
const Post = db.post;

const { Op } = require("sequelize");
const { post } = require("../app");
const { error } = require("console");
const { user } = require("../models");
const comment = require("../models/comment");

exports.findAllUsers = (req, res, next) => {
  User.findAll({
    attributes: ["id", "firstName", "lastName", "userName"],
  })
    .then((users) => {
      if (users) {
        res.status(200).json({ users });
      } else {
        return res.status(404).json({ message: "Il n'y a aucun utilisaturs" });
      }
    })
    .catch((error) => {
      console.error(error.message);
      return res.status(500).json({ message: "Internal error" + error });
    });
}

// identification d'un compte d'un user
exports.userProfil = (req, res) => {
  const idUser = req.params.id;
  console.log("idUser :", idUser)
  User.findOne({
    id: idUser,
    attributes: [
      "firstName",
      "lastName",
      "userName",
      "email",
      "password",
      "isAdmin",
    ],
  }) //A veifier
    .then((user) => {
      res.status(200).json(user); //recuperer tous le model de user
    })
    .catch((error) => {
      res.status(404).json(error);
    });
};

exports.updateUser = (req, res) => {
  //Write to Update a User informations
};

exports.deleteMyAccount = (req, res) => {
  const deletedUser = req.params.id
  const loggedUser = req.params.idUser; //l'id de user
  console.log("deletedUser :", deletedUser, "loggedUser :", loggedUser)

  if (loggedUser != null) {
    User.findOne({
      //On cherche une id d'utilisateur
      attributes: [
        "id",
        "firstName",
        "lastName",
        "userName",
        "email",
        "password",
        "isAdmin",
        "createdAt",
        "updatedAt",
      ],
      where: { id: loggedUser }, //l'id de user est trouvé et compare avec l'id dans la base de données
    })
      .then((user) => {
        //après avoir trouvé l'id de user on cherche tous les id associé a l'id trouvé plus haut
        Post.findAll({
          attributes: ["id", "postContent", "imageUrl", "likes", "dislikes", "userLikes", "usersDislikes", "createdAt", "updatedAt", "userId", "idUser"],
          where: { id: loggedUser }
        }).then((post) => {
          Comment.findAll({
            attributes: ["id", "comment", "imageUrl", "createdAt", "updatedAt", "userId", "idUser", "postId"],
            where: { id: loggedUser }
          }).then((comment) => {
            if (user && (user.isAdmin || deletedUser == loggedUser)) {
              console.log("Bonjour1:")
              User.destroy({
                where: {
                  id: deletedUser,
                },
              }).then((destroy) => {
                console.log("Bonjour2:")//consple

                for (const comments of comment) {
                  console.log("bonjour 3")
                  console.log("CommentI :", comments[i])
                  const fileNamecComment = comments.imageUrl.split("/images/")[1];
                  fs.unlink(`images/${(fileNamecComment)}`, () => {
                    console.log("bonjour 4")

                    if (!destroy) {
                      throw error;
                    } else {
                      // Si il n'y a pas d'erreur alors, l'erreur unlink est réussi
                      console.log('File deleted!');
                    }
                  })
                }

                for (const posts of post) {
                  console.log("bonjour 5")

                  const fileNamePost = posts.imageUrl.split("/images/")[1];
                  fs.unlink(`images/${(fileNamePost)}`, () => {
                    console.log("bonjour 6")

                    if (!destroy) {
                      throw error;
                    } else {
                      // Si il n'y a pas d'erreur alors, l'erreur unlink est réussi
                      console.log('File deleted!');
                    }
                  })
                }
                res.status(200).json({ message: "Utilisateur supprimée !" });
              }).catch((error) => {
                console.error(error.message);
                return res
                  .status(500)
                  .json({ error: "Ici, Internal error !" });
              });
            } else {
              res.status(403).json({ error: "Vous n'avez pas d'autorisation" })
            }
          }).catch((error) => {
            console.error(error.message)
            return res.status(404).json({ error: "Commentaires introuvable" })
          })
        }).catch((error) => {
          console.error(error.message)
          return res.status(404).json({ error: "Post introuvable" })
        })
      })
      .catch((error) => {
        console.error(error.message);
        return res.status(403).json({ error: "Utilisateur n'existe pas !" });
      });
  } else {
    return res.status(500).json({ error: "internal Error" });
  }
};

/*    User.findOne({
      //On cherche une id d'utilisateur
      attributes: [
        "id",
        "firstName",
        "lastName",
        "userName",
        "email",
        "password",
        "isAdmin",
        "createdAt",
        "updatedAt",
      ],
      where: { id: loggedUser }, //l'id de user est trouvé et compare avec l'id dans la base de données
    })
      .then((user) => {
        //après avoir trouvé l'id de user on cherche tous les id associé a l'id trouvé plus haut
        Post.findAll({
          attributes: ["id", "postContent", "imageUrl", "likes", "dislikes", "userLikes", "usersDislikes", "createdAt", "updatedAt", "userId", "idUser"],
          where: { id: loggedUser }
        })
          .then((post) => {
            // console.log("Il n'y a pas de publication trouvé de cet utilisateur", post)
            // Ic on trouve tous les commentaires associé au id de user trovuer plus haut
            Comment.findAll({
              attributes: ["id", "comment", "imageUrl", "createdAt", "updatedAt", "userId", "idUser", "postId"],
              where: { id: loggedUser }
            })
              .then((comment) => {
                // console.log("Tous les posts de l'utilisateur trouvé", comment)
                // dans le cas ou l'un d'entre eux ont des immages, on supprime les images mais aussi le compte y compris le post et les comments associé
                if (user && (user.isAdmin || loggedUser)) {
                  // if (post.imageUrl >= null || comment.imageUrl >= null) { //Je n'arrive pas recuperer imageUrl
                  // On supprime peut importe si il y a l'image ou non (supérieur ou egal a null)
                  const fileNameComment = comment.imageUrl.split("/images/")[1];
                  const fileNamePost = post.imageUrl.split("/images/")[1];
                  fs.unlink(
                    `images/${(fileNameComment, fileNamePost)
                    }`,
                    () => {
                      if (user > null || post >= null || comment >= null) {
                        // si le user, post et comment il y a des images, on les supprime de la base de donées et du serveur pour l'image
                        // On supprime aussi le post et le comment même si il n'y a rien
                        for (let i = 0; i < post.length; i++) {
                          for (let i = 0; i < comment.length; i++) {
                            User.destroy({
                              where: {
                                loggedUser: deletedUser,
                              },
                            }).then((destroyed) => {
                              res.status(200).json({ destroyed });
                            }).catch((error) => {
                              console.error(error.message);
                              return res
                                .status(500)
                                .json({ error: "Internal error !" });
                            });
                          }
                        }
                      } else {
                        res.status(403).json({
                          error:
                            "L'utilisateur n'existe pas ici, impossible de supprimer",
                        });
                      }
                    }
                  );
                  // } else {
                  //   // Si il y a moins que null, impossible
                  //   res
                  //     .status(403)
                  //     .json({ error: "Impossible de supprimer!" });
                  // }
                } else {
                  return res.status(403).json({
                    message:
                      "Vous n'avez pas d'autorisation pour effacer ce compte !",
                  });
                }

              })
              .catch((error) => {
                console.error(error.message);
                return res.status(403).json({
                  error: "Il n'y a pas de message trouvé de cet utilisateur",
                });
              });
          })
          .catch((error) => {
            console.error(error.message);
            res.status(403).json({ message: "La publication n'existe pas!" });
          });
      })
      .catch((error) => {
        console.error(error.message);
        return res.status(403).json({ error: "Utilisateur n'existe pas !" });
      });
  } else {
    return res.status(500).json({ error: "internal Error" });
  }*/