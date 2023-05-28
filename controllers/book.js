const Book = require("../models/Book");
const fs = require("fs");

exports.getAllBooks = (request, response) => {
  Book.find()
    .then((books) => response.status(200).json(books))
    .catch((error) => response.status(400).json({ error: error.message }));
};

exports.getOneBook = (request, response) => {
  Book.findOne({ _id: request.params.id })
    .then((book) => response.status(200).json(book))
    .catch((error) => response.status(400).json({ error: error.message }));
};

exports.createBook = (request, response) => {
  const bookObject = JSON.parse(request.body.book);
  const book = new Book({
    ...bookObject,
    userId: request.auth.userId,
    imageUrl: `${request.protocol}://${request.get("host")}/images/${
      request.file.filename
    }`,
    ratings:
      bookObject.ratings[0].grade === 0
        ? []
        : { userId: request.auth.userId, grade: bookObject.ratings[0].grade },
    averageRating:
      bookObject.ratings[0].grade === 0 ? 0 : bookObject.ratings[0].grade,
  });
  book
    .save()
    .then(() =>
      response
        .status(201)
        .json({ book: book })
        .send(console.log("Book created successfully !"))
    )
    .catch((error) => response.status(400).json({ error: error.message }));
};

exports.updateBook = (request, response) => {
  Book.findOne({ _id: request.params.id })
    .then((book) => {
      if (book.userId != request.auth.userId) {
        response.status(403).json({ message: "Unauthorized request" });
      } else {
        let bookObject;

        if (request.file) {
          const filename = book.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => "");

          bookObject = {
            ...JSON.parse(request.body.book),
            imageUrl: `${request.protocol}://${request.get("host")}/images/${
              request.file.filename
            }`,
          };
        } else {
          bookObject = {
            ...request.body,
          };
        }

        Book.updateOne(
          { _id: request.params.id },
          { ...bookObject, _id: request.params.id, userId: request.auth.userId }
        )
          .then(() =>
            response
              .status(200)
              .json({ message: "Book modified successfully !" })
          )
          .catch((error) => response.status(400).json({ error }));
      }
    })
    .catch((error) => response.status(400).json({ error: error.message }));
};

exports.deleteBook = (request, response) => {
  Book.findOne({ _id: request.params.id })
    .then((book) => {
      if (book.userId != request.auth.userId) {
        response.status(403).json({ message: "Unauthorized request" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          book
            .deleteOne({ _id: request.params.id })
            .then(() =>
              response
                .status(201)
                .json({ book: book })
                .send(console.log("Book delete successfully !"))
            )
            .catch((error) =>
              response.status(400).json({ error: error.message })
            );
        });
      }
    })
    .catch((error) => response.status(400).json({ error: error.message }));
};
