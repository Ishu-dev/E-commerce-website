import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
// import User from "../models/user.js";
import APIFilters from "../utils/apiFilters.js";

export const getProducts = catchAsyncErrors(async (req, res) => {
  //26
  const resPerPage = 4;

  //24 applying filters
  const apiFilters = new APIFilters(Product, req.query).search().filters();

  //32
  console.log("req?.User", req?.user);

  let products = await apiFilters.query;
  let filteredProductsCount = products.length;

  //26
  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();

  res.status(200).json({
    resPerPage,
    filteredProductsCount,
    products,
    message: "All Products",
  });
});

//create new Product   =>  /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(200).json({
    product,
    message: "new product",
  });
});

//get single product details => /api/v1/products/id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id); //mongoose function findById

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
    //next is a middleware provided by expressjs to execute next  middleware in middleware stack

    // return res.status(404).json({
    //   error: "Product not found",
    // });
  }

  res.status(200).json({
    product,
    message: "here is the product details",
  });
});

//update single product details => /api/v1/products/id
export const updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id); //mongoose function findById

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
    // return res.status(404).json({
    //   error: "Product not found",
    // });
  }

  await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });

  res.status(200).json({
    product,
    message: "Product updated",
  });
});

// delete product =>  /api/v1/products/id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id); //mongoose function findById

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
    // return res.status(404).json({
    //   error: "Product not found",
    // });
  }

  product = await Product.deleteOne();

  // product = await Product.findByIdAndDelete(req?.params?.id, req.body, {
  //   new: false,
  // });

  res.status(200).json({
    product,
    message: "product deleted",
  });
});
