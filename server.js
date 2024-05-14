const express = require("express");
const app = express();
const con = require('./db');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const PORT = 3000;
const copyright = "Alioune DIOP 2024";

//dire a express de considerer le dossier 'public' comme un dossier contenant des fichiers accessibles par un poste client
app.use("/public", express.static("public"));

//pour dire que les vues seront dans le dossiers ./views
app.set("views", "./views");
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'))


app.get("/", (req, res) => {
  const sql = "select * from movie order by id desc";
  con.query(sql, (err,rows) => {
    if (err){
      throw err;
    }
    
    res.render("accueil.ejs", {
      title: 'La liste des films depuis server.js',
      data: rows,
      copyright} );
})  
});

app.get('/ajout', (req, res, next) => {
  res.render('./pages/films/ajout.ejs', {
    title: 'Formulaire d\'ajout film',
    copyright
  })
});


app.get('/:id', (req, res)=> {
  
  const id = req.params.id;
  console.log("id a modifier => " + id);
  
  //const sql = "select * from movie where id = " + id;
  const sql = "select * from movie where id = ? ";
  con.query(sql, id, (err, result) => {
    res.render('./pages/films/modif.ejs', {
      title: "Formulaire de modification de film",
      copyright,
      data: result[0]
    });
  })
})

app.post('/ajout', (req, res) => {
  const data = {
    title: req.body.titre,
    description: req.body.description,
    year: req.body.annee,
    author: req.body.auteur,
    is_serie: req.body.categorie,
    genre: req.body.genre,
  }
  
  const sql = "insert into movie set ?";
  con.query(sql, data, (err, result) => {
    if (err) throw err;
    
    console.log("Film avec id => " + result.insertId + " ajouté avec succès");
    
    res.redirect("/");
  });
})

app.put("/modif/:id", (req, res) => {
  const id = req.params.id;
  const data = {
    title: req.body.titre,
    description: req.body.description,
    year: req.body.annee,
    author: req.body.auteur,
    is_serie: req.body.categorie,
    genre: req.body.genre,
  } 
  const sql = "update movie set ? where id = ?";
  con.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    
    res.redirect("/");
  });
});

app.get('/detail/:id', (req, res)=> {
  
  const id = req.params.id;
  console.log("id a Detailler => " + id);
  
  //const sql = "select * from movie where id = " + id;
  const sql = "select * from movie where id = ?";
  con.query(sql, id, (err, result) => {
    res.render('./pages/films/detail.ejs', {
      title:"Detail Film",
      titles:""+result[0].title,
      genre:""+result[0].genre,
      year:""+result[0].year,
      author:""+result[0].author,
      copyright,
      description: result[0].description
    });
  })
});

app.get("/supprimer/:id", (req, res) => {
  const id = req.params.id;

  const sql = "delete from movie where id = ?"
  con.query(sql,id, (err, result) => {
    if (err) throw err;

    res.redirect("/");
  });
}); 


app.listen(PORT, () => {
  console.log("server listening on port: " + PORT);
});
