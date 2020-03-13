const db = require('../db');

module.exports = {
    
    getPosts(req, res) { 
        db.query('SELECT * FROM `posts`', (err, result) => {
            if (err) throw err;
            res.status(200).send(result);
        });
        //res.status(200).send(req.store.posts);
    },
    
    addPost(req, res) { 
        let newPost = req.body;
        let name = newPost['name'];
        let url = newPost['url'];
        let postText = newPost['postText'];
        let postId = Math.floor(100 + Math.random() * 900);

        db.query('INSERT INTO `posts` (`id`, `name`, `url`, `postText`) VALUES (?, ?, ?, ?);', [postId, name, url, postText], (err, result) => {
            if (err) throw err;
            res.status(201).send({postId: postId});
        });
    },
     
    updatePost(req, res) {
        let updatedPost = req.body;
        let updatedPostId = req.body['id'];
        let newName = updatedPost['name'];
        let newUrl = updatedPost['url'];
        let newPostText = updatedPost['postText'];

        db.query('UPDATE `posts` SET `name` = ?, `url` = ?, `postText` = ? WHERE `id` = ?', [newName, newUrl, newPostText, updatedPostId], (err, result) => {
            if (err) throw err;
            res.status(200).send(result);
        })
        // req.store.posts[req.params.postId] = Object.assign(req.store.posts[req.params.postId], req.body);
        // res.status(200).send(req.store.posts[req.params.postId]);
    },
    
    removePost(req, res) {
        let post = req.body;
        let id = post['id'];

        db.query('DELETE FROM `posts` WHERE id = ?', [id], (err, result) => {
            if (err) throw err;
            res.status(204).send();
        });
    }
    
}