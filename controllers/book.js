const Book = require("../models/Book");

exports.getAllBooks = (request, response) => {
  Book.find()
    .then((books) => response.status(200).json(books))
    .catch((error) => response.status(400).json({ error }));
};

exports.getOneBook = (request, response) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => response.status(200).json(book))
    .catch((error) => response.status(400).json({ error }));
};

exports.createBook = (request, response) => {
  const bookObject = request.body;
  const book = new Book(bookObject);
  book
    .save()
    .then(() =>
      response
        .status(201)
        .json({ book: book })
        .send(console.log("Book created successfully !"))
    )
    .catch((error) => response.status(400).json({ error }));
};
