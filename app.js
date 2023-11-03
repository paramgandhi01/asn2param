var express = require('express'); // importing the express module
var path = require('path'); // importing the path module
const fs = require('fs');
const bodyParser = require('body-parser');
var app = express();    //an instance of express
const exphbs = require('express-handlebars'); //importing the express-handlebars
const port = process.env.port || 3000; //defining the port
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //serving static files from the public directory
//using handlebars as view engine and telling the express the extension of it
app.engine('.hbs', exphbs.engine(
    { extname: '.hbs',
    helpers: {
    ne: function (value1, value2) {
      if (value1 != value2) {
        return (value1);
      }  } , 
        zero: function (rating) {
        if(rating==0){
            rating='zero';
            return(rating);
        }
        else{
            return(rating);
        } },
            eq: function (value1, value2) {
              if (value1 === value2) {
                return (value1);
              }
            },
            row: function (rating) {
                if(rating==0){
                    rating='row';
                    return(rating);
                }
                else{
                    rating='';
                    return(rating);
                } },
                invo: function(value1,value2){
                    if(value1===value2){
                        return(value1);
                    }
                }
          }
    })); 
app.set('view engine', 'hbs');

//root path
app.get('/', function(req, res) {
  res.render('partials/index', { title: 'Express' });
});
// /users path
app.get('/users', function(req, res) {
  res.send('respond with a resource');
});
app.get('/viewData', function(req, res) {
    const data = fs.readFileSync('SuperSales.json');
    const jsonData = JSON.parse(data);
    res.render('partials/sales', { jsonData });
});
app.get('/allData', function(req, res) {
    const data = fs.readFileSync('ite5315-A1-Car_sales.json');
    const jsonData = JSON.parse(data);
    res.render('page/alldata', { jsonData });
});

app.get('/allData/invoiceID/:indexno', function(req, res) {
    const index = parseInt(req.params.indexno);
    const data = fs.readFileSync('SuperSales.json');
    const jsonData = JSON.parse(data);
    const data1 = jsonData[index];
    res.render('page/index', { data1 });
});

//search invoice id
app.get('/search/InvoiceID', (req, res) => {
    res.render('page/searchinvoice');
  });

  app.post('/search/InvoiceID', function(req, res) {
    const num =req.body.in;
    console.log(num);
    const data = fs.readFileSync('SuperSales.json');
    const jsonData = JSON.parse(data);
    const filteredData = jsonData.filter(item => item['Invoice ID'] === num);
    res.render('page/search', { filteredData });
});

//search productline
app.get('/search/productLine', (req, res) => {
    res.render('page/productsearch');
  });

  app.post('/search/productLine', function(req, res) {
    const product =req.body.productLine;
    const data = fs.readFileSync('SuperSales.json');
    const jsonData = JSON.parse(data);
    const filteredData = jsonData.filter(item => item['Product line'] === product);
    res.render('page/product', { filteredData });
});

//error page to show when the path gets accessed which is not defined
app.get('*', function(req, res) {
  res.render('partials/error', { title: 'Error', message:'Wrong Route' });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})