module.exports = (ratingsBook) => {
  const ratings = ratingsBook.map((rating) => rating.grade);

  let average = 0;

  ratings.map((rating) => (average += rating / ratings.length));

  return parseInt(average);
};
