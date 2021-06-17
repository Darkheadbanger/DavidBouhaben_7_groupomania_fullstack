const db = require("../models");

const Comment = db.comment;
const User = db.user;
const Post = db.post;

const { Op } = require("sequelize");
const { post } = require("../app");

exports.findAllUsers = (req, res, next) => {
  User.findAll(
    {
    //SELECT * WHERE User WHERE id => 0 donc tous l'id de 0 à l'infiniit/tous les id
    where: {
      id: {
        [Op.gte]: 0,
      },
    },
  }
  )
    .then((users) => {
      res
        .status(200)
        .json({ users });
    })
    .catch((error) => {
      console.error(error.message);
      return res.status(400).json({ error });
    });
};
// :odificqtion de users donc ;dp et username
exports.findOneUser = (req, res) => {
  const _id = req.params.id;
  const isAdmin = req.body.isAdmin;
  const reqBodyUser = req.body.User;
  const reqBodyPost = req.body.Post;
  const reqBodyComment = req.body.Comment;
  if (isAdmin && User)
    User.findOne({
      id: _id,
      id: { [Op.eq]: _id },
    }) //A veifier
      .then((user) => {
        res.status(200).json(...reqBodyUser); //recuperer tous le model de user
      })
      .then((post) => {
        res.status(200).json(...reqBodyPost); //recuperer tous leles posts de cette utilisateur
      })
      .then((comment) => {
        res.status(200).json({ ...reqBodyComment }); //recuperer tous les comments de cette utilisateur la
      });
};

exports.updateUser = (req, res) => {
  //Write to Update a User informations
}

// pour effqcer un
exports.deleteOneAccount = (req, res) => {
  const isAdmin = req.body.isAdmin;//sois res.query.admin
  const _id = req.body.id;
  if (isAdmin && !User) {
    const user = User.findOne({
      //Il faut utiliser destroy
      where: {
        id: _id, id: {
          [Op.gte]: 0,
        }
      },
    }).then((user) => {
      user.destroy();
      return res.status(200).json({ user })
    }).then((error) => {
      console.log(error.message)
      return res.status(401).json({ error })
    })
    post.destroy();
    comment.destroy();
  }
};

exports.deleteMyAccount = (req, res, next) => {
  //delete mais !isAdmin
}
