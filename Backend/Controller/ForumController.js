const Post = require('../models/Post');
const Commentaire = require('../models/Commentaire');
const Message = require('../models/Message');
  //*********************CRUD POST******************* */
    async function  addPost(req, res) {
      try {
        console.log(req.body);
        const post = new Post({
            idAuteur: req.body.idAuteur,
            titre: req.body.titre,
            contenu : req.body.contenu,
            date_creation : new Date().toISOString(),
            like : 0
      });
        await post.save();
        res.status(201).json({message: "Post ajouté avec succès",post});
       
      } catch (err) {
        console.log(err);
      }
    }

    async function getallPost(req, res) {
        try {
          const post = await Post.find();
      
          res.status(200).json(post);
        } catch (err) {
          console.log(err);
        }
      }

      async function getPostById(req, res) {
          try {
            const post = await Post.findById(req.params.id);
        
            res.status(200).json(post);
          } catch (err) {
            console.log(err);
          }
        }


         async function deletePost(req, res) {
            try {
              const post = await Post.findByIdAndDelete(req.params.id);
          
              res.status(200).json(post);
            } catch (err) {
              console.log(err);
            }
          }

          async function updatePost(req, res) {
            try {
              const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
              });
          
              res.status(200).json(post);
            } catch (err) {
              console.log(err);
            }
          }

 //*********************CRUD COMMENTAIRE******************* */

 async function  addCommentaire(req, res) {
  try {
    console.log(req.body);
    const comment = new Commentaire({
        idAuteur: req.body.idAuteur,
        idPost: req.body.idPost,
        contenu : req.body.contenu,
        date_creation : new Date().toISOString(),
        
  });
    await comment.save();
    res.status(201).json({message: "Commentaire ajouté avec succès",comment});
   
  } catch (err) {
    console.log(err);
  }
}

async function getallCommentaire(req, res) {
    try {
      const comment = await Commentaire.find();
  
      res.status(200).json(comment);
    } catch (err) {
      console.log(err);
    }
  }

  async function getCommentaireById(req, res) {
      try {
        const comment = await Commentaire.findById(req.params.id);
    
        res.status(200).json(comment);
      } catch (err) {
        console.log(err);
      }
    }


     async function deleteComment(req, res) {
        try {
          const comment = await Commentaire.findByIdAndDelete(req.params.id);
      
          res.status(200).json(comment);
        } catch (err) {
          console.log(err);
        }
      }

      async function updateComment(req, res) {
        try {
          const comment = await Commentaire.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
          });
      
          res.status(200).json(comment);
        } catch (err) {
          console.log(err);
        }
      }

     



    module.exports={
        addPost,
        getallPost,
        getPostById,
        deletePost,
        updatePost,
        addCommentaire,
        getallCommentaire,
        getCommentaireById,
        deleteComment,
        updateComment
        //getAllMessages
      
        
    }