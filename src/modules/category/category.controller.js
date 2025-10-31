import Category from "../../models/Category.model.js";
//create category
export const createCategory = async (req, res) => {
  try {
    const { categoryName, categoryType } = req.body;

    if (!categoryName || !categoryType) {
      return res.status(400).json({ success: false, message: "Both name and type are required" });
    }

    const newCategory = await Category.create({ categoryName, categoryType });
    res.status(201).json({ success: true, message: "Category created successfully", data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

//get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

//get specific category
export const getStoreCategories = async (req, res) => {
  try {
    const categories = await Category.find({ categoryType: "Store" });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

//get factory specific category
export const getFactoryCategories = async (req, res) => {
  try {
    const categories = await Category.find({ categoryType: "Factory" });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};