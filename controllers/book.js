const Book = require("../models/Book");
const fs = require("fs");
const averageRating = require("../utils/averageRating");

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
      request.file.editedName
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
      console.log(request.auth);
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
              request.file.editedName
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

exports.ratingBook = (request, response) => {
  Book.findOne({ _id: request.params.id })
    .then((book) => {
      const ratings = [...book.ratings];

      // Check if user rated already the book
      const isRated = ratings.some(
        (rating) => rating.userId === request.auth.userId
      );

      if (isRated) {
        response.status(403).json({ message: "Unauthorized request" });
      } else {
        ratings.push({
          userId: request.auth.userId,
          grade: request.body.rating,
        });

        Book.updateOne(
          { _id: request.params.id },
          { ratings: ratings, averageRating: averageRating(ratings) }
        )
          .then(() =>
            response.status(200).json({ message: "Book rating successfully !" })
          )
          .catch((error) => response.status(400).json({ error }));
      }
    })
    .catch((error) => response.status(400).json({ error: error.message }));
};

exports.bestRatingBooks = (request, response) => {
  Book.find()
    .then((books) => {
      // bestRating return array of 3 books with the best average rating
      const bestRating = books
        .sort(
          (currentBook, nextBook) =>
            nextBook.averageRating - currentBook.averageRating 
        )
        .splice(0, 3);
      response.status(200).json(bestRating);
    })
    .catch((error) => response.status(400).json({ error: error.message }));
};
