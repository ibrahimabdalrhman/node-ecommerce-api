const express = require("express");

const router = express.Router({ mergeParams: true });
const subCategoryService = require("../services/subCategoryService");
const {
    getSubCategoryValidator,
    postSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const { auth, allowTo } = require("../services/authService");

router
    .route("/")
    .post(
        auth,
        allowTo("admin", "manager"),
        subCategoryService.uploadSubCategoryImage,
        subCategoryService.resizeImage,
        postSubCategoryValidator,
        subCategoryService.postSubCategory
    )
    .get(subCategoryService.getSubCategory);

router
    .route("/:id")
    .get(getSubCategoryValidator, subCategoryService.getSubCategoryById)
    .put(
        auth,
        allowTo("admin", "manager"),
        subCategoryService.uploadSubCategoryImage,
        subCategoryService.resizeImage,
        updateSubCategoryValidator,
        subCategoryService.updateSubCategory
    )
    .delete(
        auth,
        allowTo("admin", "manager"),
        deleteSubCategoryValidator,
        subCategoryService.deleteSubCategory
    );

module.exports = router;