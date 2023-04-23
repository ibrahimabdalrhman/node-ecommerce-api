const express = require("express");
// eslint-disable-next-line import/no-extraneous-dependencies
const subCategoryRoute = require("./subCategoryRoute");
const {auth,allowTo }  = require("../services/authService");


const router = express.Router();
const categoryService = require('../services/categoryService');
const {
    getCategoryValidator,
    postCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator } = require('../utils/validators/categoryValidator');
    

router.use("/:id/subcategories", subCategoryRoute);

router
  .route("/")
  .post(
    auth,
    allowTo("admin", "manager"),
    categoryService.uploadCategoryImage,
    categoryService.resizeImage,
    postCategoryValidator,
    categoryService.postCategory
  )
  .get(categoryService.getCategory);

router
  .route("/:id")
  .get(getCategoryValidator, categoryService.getCategoryById)
  .put(
    auth,
    allowTo("admin", "manager"),
    categoryService.uploadCategoryImage,
    categoryService.resizeImage,
    updateCategoryValidator,
    categoryService.updateCategory
  )
  .delete(
    auth,
    allowTo("admin", "manager"),
    deleteCategoryValidator,
    categoryService.deleteCategory
  );

module.exports = router;