//const fse = require("fs-extra");
const db = require("../models");
const fs = require("fs");
// const modelPost = require("../models/post.model");

const Post = db.post; // post depuis model Post
const User = db.user; // user depuis model User/Auth
const Comment = db.comment;

exports.createPost = (req, res, next) => {
  //Declarations des varibales po ur récuperer les données du modèles
  const userId = req.body.userId;
  // const postObject = JSON.parse(req.body.post)
  console.log("Ici c'est object :", postObject);
  const urlImage = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  //const bodyPost = req.body;
  console.log("Post created");
  if (userId) {
    const post = new Post({
      // ...postObject,
      postContent: req.body.postContent,
      //imageUrl: req.body.imageUrl,
      //Ici pour multer
      //Ici pour multer, req.protocol pour récuperer le protocol donc http, on ajoute ://, esuite on utilise req.get('host') pour chopper le port qu'on écoute (port 3000) et nous ajoutons /images/ pour l'emplacement ou on stocke l'image et a la fin on on ajoute lenom de fichier de l'origine en utilisant la
      imageUrl: urlImage,
      idUser: userId,
    });
    post
      .save()
      .then(() => {
        res
          .status(200)
          .json({ message: "Objet enregistrée à la base de données" });
      })
      .catch((error) => {
        console.error(error.message);
        return res.status(500).json({ error });
      });
  } else {
    return res.status(403).json({ message: "Vous n'avez pas acces!" });
  }
};
//exports.createLikeDislike = (req, res, next) => {};

exports.getAllPost = (req, res, next) => {
  //On trouve tous les posts, ensuite on montre tous les posts qu'on trouve
  Post.findAll({
    include: [
      {
        model: User,
        attributes: ["userName"],
      },
    ],
    order: ["createdAt"], //DESC ou non ?
  })
    .then((user) => {
      if (user <= null) {
        return res.status(404).json({ message: "Pas de publication!" });
      } else {
        return res.status(200).json({ user });
      }
    })
    .catch((error) => {
      console.error(error.message);
      return res.status(500).json({ message: "ici", error });
    });
};

// exports.getOnePost = (req, res, next) => {
//   const userId = req.params.userId;
//   Post.findOne({
//     // On cherche un post
//     where: {
//       //id: userId, // On compare
//       idUser: userId,
//     },
//     include: {
//       model: User,
//       //as: User,
//     },
//     order: [["id", "DESC"]], //Pour dire les derniers ID reçu
//   })
//     .then((user) => {
//       return res.status(200).json({ user });
//     })
//     .catch((error) => {
//       console.error(error.message);
//       return res.status(404).json({ error });
//     });
// };

// exports.getMyAllPost = (req, res, next) => {
//   // Je ne sais pas encore
//   const userId = req.body.userId;

//   Post.findAll({
//     where: { id: userId },
//     include: {
//       model: User,
//     },
//     order: [["id", "DESC"]],
//   })
//     .then((post) => {
//       res.status(200).json({ post });
//     })
//     .catch((error) => {
//       console.error(error.message);
//       return res.status(400).json({ error });
//     });
// };
///Multer fonctionne mais change pas d'image car on ne peut pas créer l'image et le sauvegarde dans le server
exports.updatePost = (req, res, next) => {
  const postId = req.params.id; // l'id du post
  const userId = req.body.userId; //l'id de user
  const postObject = req.file
    ? {
        // Si la personne rajoute un nouvel image
        ...json.parse(req.body.post),
        postContent: req.body.postContent,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { postContent: req.body.postContent }; // Si non, on ne modifie que le postContent
  console.log("Bonjour", userId);
  User.findOne({
    attributes: ["id", "email", "userName", "isAdmin"],
    where: { id: userId },
  })
    .then((user) => {
      Post.findOne({
        where: {
          id: postId,
        },
      })
        .then((postFind) => {
          console.log("Hey :", postFind.idUser);
          if (user && (user.isAdmin == true || user.id == postFind.idUser)) {
            if (postFind) {
              Post.update(
                {
                  postObject,
                  // postContent: req.body.postContent,
                  // imageUrl: req.body.imageUrl,
                  id: postId,
                },
                {
                  where: { id: postId },
                }
              )
                .then(() => {
                  return res.status(200).json({ message: "Objet modifiée" });
                })
                .catch((error) => {
                  console.error(error.message);
                  return res.status(500).json({ error });
                });
            } else {
              res.status(404).json({ message: "Le post introuvable !" });
            }
          } else {
            res.status(403).json({
              message:
                "Vous n'avez pas l'autorisation pour modifier ce message!",
            });
          }
        })
        .catch((error) => {
          console.error(error.message);
          return res.status(500).json({ error });
        });
    })
    .catch((error) => {
      console.error(error.message);
      return res.status(403).json({
        message: "Vous n'avez pas d'autorisation pour modifier ce post !",
      });
    });
};

exports.deletePost = (req, res) => {
  const postId = req.params.id; // l'id du post
  const userId = req.body.userId; //l'id de user
  User.findOne({
    //On cherche une id d'utilisateur
    attributes: ["id", "email", "userName", "isAdmin"],
    where: { id: userId }, //l'id de user est trouvé et compare avec l'id dans la base de données
  })
    .then((user) => {
      //après avoir trouvé l'id de user
      console.log("aca", user.isAdmin);
      console.log("ici c'est", userId);
      Post.findOne({
        where: {
          id: postId,
        },
      })
        .then((postFind) => {
          //Une fois le post qui correspond a l'id de l'user trouvé, on extrait le nom du fichier (image) à supprimer et on supprimer avec fs.unlinnk, et une fois que la suppression du fichier est fait, on fait la suppreson de l'objet de la base de données
          const fileName = postFind.imageUrl.split("/images/")[1];
          fs.unlink(`images/${fileName}`, () => {
            console.log("Hey :", postFind.idUser);
            if (user && (user.isAdmin == true || user.id == postFind.idUser)) {
              //on fait une condition, si c'est un admin (true) ou si c'est l'id de l'utilisateur, on peut accder a la publication
              if (postFind) {
                //Si l'id de post a été envoyé dans la requête
                //Il faut faire une requête postId pour vérifier s'il existe en bdd avant destroy, si non on envoie message erreur
                Post.destroy({
                  // attributes: ['id', 'postContent', 'imageUrl'],// Mettre les attributs pour pouvoir trouver l'id du post et l'effacer par rapport à l'id de user qu'il a mis pour qu'il puisse effacer sa pubication, admin peut effacer tous le monde pub
                  where: { id: postId }, // Alors, on trouve l'id du poste cet utilisateur là
                })
                  .then(() => {
                    return res
                      .status(200)
                      .json({ message: "Publication supprimée" });
                  })
                  .catch(() => {
                    console.error(error.message);
                    return res.status(500).json({ error });
                  });
              } else {
                res
                  .status(404)
                  .json({ message: "La publication introuvable!" });
              }
            } else {
              // Si on ne trouve pas ni l'admin ni l'utilisateur qui a publier cette pubication, alors, on a pas acces pour effacer la publication
              return res
                .status(403)
                .json({ message: "Vous ne pouvez pas effacer ce post !" });
            }
          });
        })
        .catch((error) => {
          console.error(error.message);
          res.status(404).json({ message: "La publication n'existe pas!" });
        });
    })
    .catch((error) => {
      error.console(error.message);
      return res.status(500).json({ error });
    });
};
