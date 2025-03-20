const Post = require('../models/Post');
  
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





    module.exports={
        addPost,
        getallPost,
        getPostById,
        deletePost,
        updatePost 
    }