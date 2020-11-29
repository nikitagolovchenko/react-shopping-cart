// подключаем нужные пакеты:
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortid = require('shortid');

// создаем веб-сервер:
const app = express();
app.use(bodyParser.json());

// указываем путь к index.html:
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
}

// инициализируем данные сети:
mongoose.connect('mongodb+srv://dbNikita:ba1715niki@cluster0.cxqfh.mongodb.net/dbNikita?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

// создаем модель данных mongodb:
const Product = mongoose.model(
  'products',
  new mongoose.Schema({
    _id: { type: String, default: shortid.generate },
    title: String,
    description: String,
    image: String,
    price: Number,
    availableSizes: [String],
  })
);

// обработка запросов (http://localhost:5000/api/products/):
app.get('/api/products', async (req, res) => {
  const products = await Product.find({});
  res.set('Access-Control-Allow-Origin', '*'); // CORS - любому хосту разрешен доступ к этому URL и ответу в браузере
  res.send(products);
});

app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.set('Access-Control-Allow-Origin', '*'); // CORS - любому хосту разрешен доступ к этому URL и ответу в браузере
  res.send(savedProduct);
});

app.delete('/api/products/:id', async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.set('Access-Control-Allow-Origin', '*'); // CORS - любому хосту разрешен доступ к этому URL и ответу в браузере
  res.send(deletedProduct);
});

// создаем модель ореда заказа:
const Order = mongoose.model(
  'order',
  new mongoose.Schema(
    {
      _id: {
        type: String,
        default: shortid.generate,
      },
      email: String,
      name: String,
      address: String,
      total: Number,
      cartItems: [
        {
          _id: String,
          title: String,
          price: Number,
          count: Number,
        },
      ],
    },
    {
      timestamps: true, //автоматически добавляеются свойства createdAt, updatedAt - дата и время
    }
  )
);

// создаем post api:
app.post('/api/orders', async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.address ||
    !req.body.total ||
    !req.body.cartItems
  ) {
    return res.send({ message: 'Data is required!' });
  }

  const order = await Order(req.body).save();
  res.send(order);
});

// запускаем express сервер:
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('server at http://localhost:5000'));
