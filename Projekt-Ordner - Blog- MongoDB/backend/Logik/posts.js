const Post = require("../models/post");



// Erstelle einen Post ----------------------------------------------------------------------->

exports.erstellePost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
      const post = new Post({  // Der neue Post
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/bilder/" + req.file.filename,
        creator: req.userData.userId  // User-Id für Post
      });
     //console.log(req.userData);
      post.save().then(createdPost => {
        res.status(201).json({
          message: "Post erfolgreich hinzugefügt!",
          post: { id: createdPost.id, title: createdPost.title, content: createdPost.content, imagePath: createdPost.imagePath }
        });
      }).catch(error => {
        res.status(500).json({
          message: "Das Erstellen des Posts ist fehlgeschlagen!"
        })
      });
    }



    
//  Alle Posts abrufen ----------------------------------------------------------------------->

exports.bekommeAllePosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;  // um Paginator zu konfigurieren // pageSize = Anzahl Posts auf der Seite
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
 
    if (pageSize && currentPage) {       // um eine bestimmte Anzahl an Posts abzurufen
     postQuery
     .skip(pageSize * (currentPage - 1)) // skip = überspringe die ersten (x) Posts
     .limit(pageSize);                             // limit = beschrängt Posts auf festgelegte Anzahl aus pageSize
    }
    // console.log(req.query); // z.B. lokalhost:3000/api/posts/?pagesize=5&page=1 würde ausgeben { pagesize: '5', page: '1'}
 
     postQuery.then(documents => { // gibt alle Daten der Posts aus
       fetchedPosts = documents;  // um es im zweiten then Block anwenden zu können
       return Post.count();  // gibt die Anzahl der gefundenen Daten zurück als Zahl
     })
       .then(count => {
         res.status(200).json({
           message: "Posts erfolgreich abgerufen!",
           posts: fetchedPosts,
           maxPosts: count
       });
     }).catch(error => {
       res.status(500).json({
         message: "Posts konnten nicht abgerufen werden!"
       })
     });
   }

//  Einen Post abrufen ----------------------------------------------------------------------->

exports.findeEinenPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Dieser Post wurde nicht gefunden!" });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Posts konnte nicht abgerufen werden!"
      })
    });
  }

//  Einen Post bearbeiten ----------------------------------------------------------------------->

exports.bearbeitePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
     if (req.file) {
       const url =  req.protocol + '://' + req.get("host");
       imagePath = url + "/bilder/" + req.file.filename
     }
  
      const post = new Post({   // Der aktualisierte Post
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
      });
      console.log(post);
      Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => { // sorgt dafür, dass Posts nur bearbeitet werden können, wenn die Post Id und User Id zusammenpassen
        //console.log(result);
        if(result.n > 0) { // nModified ist bei fail 0 und bei erfolg 1+
          res.status(200).json({ message: "Erfolgreich aktualisiert!" });
        } else {
        res.status(401).json({ message: "Nicht authorisiert!" });
        }
      }).catch(error => {
        res.status(500).json({
          message: "Posts wurden nicht aktualisiert!"
        })
      });
    }

//  Einen Post löschen ----------------------------------------------------------------------->

exports.loeschePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
      //console.log(result);
      if(result.n > 0) { // n ist bei fail 0 und bei erfolg 1+
        res.status(200).json({ message: "Der Post wurde gelöscht!" });
      } else {
      res.status(401).json({ message: "Nicht authorisiert!" });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Post konnte nicht gelöscht werden!"
      })
    });
  }