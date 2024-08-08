class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //!1A) Basic filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString }; //shallow copy
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //!1B) Advanced filtering (gte,lte,etc..)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //!2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else this.query = this.query.sort('-createdAt');
    return this;
  }

  limit() {
    //!3) Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); //?projection
    } else this.query = this.query.select('-__v');
    return this;
  }

  paginate() {
    //!4) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 12;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
