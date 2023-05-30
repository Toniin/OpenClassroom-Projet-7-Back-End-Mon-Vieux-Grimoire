module.exports = (ratingsBook) => {
  const ratings = ratingsBook.map(rating => rating.grade)

  let average = 0;
  for(const rating of ratings) {
  average += rating/ratings.length;
  }
  
  return parseInt(average)
}