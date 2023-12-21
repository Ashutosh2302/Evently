"use server";

import { CreateCategoryParams } from "@/types";
import { connectToDatabase } from "../database";
import Category, { ICategory } from "../database/models/category.model";

export const createCategory = async (
  category: CreateCategoryParams
): Promise<ICategory> => {
  try {
    await connectToDatabase();
    const newCategory = await Category.create({ name: category.categoryName });
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    console.error(error);
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    await connectToDatabase();
    const categories = await Category.find();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error(error);
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
