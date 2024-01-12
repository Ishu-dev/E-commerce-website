import { Long } from "mongodb";

class APIfilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword, //not exactly matchin the keyword
            $options: "i", //case insensitive keyword ie apple or Apple does not matter
          },
        }
      : {};
    this.query = this.query.find({
      ...keyword,
    }); //... spread operator
    return this;
  }

  //25
  filters() {
    const queryCopy = { ...this.queryStr }; //making copy of queryString to play with values

    const fieldsToRemove = ["keyword", "page"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    console.log("================");
    console.log(queryStr);
    console.log("================");

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
  }
}

export default APIfilters;
