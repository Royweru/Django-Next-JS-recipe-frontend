"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { ACCESS_TOKEN } from "@/constants";
import Link from "next/link";
import { EditRecipeModal } from "@/components/ui/edit-recipe-modal";

const MyRecipesPage = () => {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);

  const [loading, setLoading] = useState(true);
  const [editRecipe, setEditRecipe] = useState<RecipeType | null>(null);
  const [categories,setCategories]= useState<CategoryType[]>([]);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipes/my-recipes/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            },
          }
        );
        setRecipes(response.data);
      } catch (err) {
        setError("Failed to fetch your recipes. Please try again.");
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
    fetchCategories();
  }, []);

  const fetchCategories= async () =>{
     try {
         const res = await axios.get( `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/`)
         if(res.data){
            setCategories(res.data)
         }
     } catch (error) {
        console.error("Error occured while fetching categories: ", error)
     }
  }
  const handleDeleteRecipe = async (slug: string) => {
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipes/${slug}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete recipe. Please try again.");
      console.error("Error deleting recipe:", err);
    } finally {
      setLoading(false);
    }
  };

  const onClose  =  () =>{
     setEditRecipe(null)
  }
  const onUpdate  =  (response:any) =>{
     console.log(response)
  }

  if (loading && recipes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600">
              Loading your recipes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <Link href={"/"}>
            <button className=" bg-neutral-800 text-white font-semibold">
              Back to home page
            </button>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your culinary creations
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No recipes yet
            </h3>
            <p className="mt-1 text-gray-500">
              Get started by creating your first recipe!
            </p>
            <div className="mt-6">
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Recipe
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                {recipe.featured_image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={recipe.featured_image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {recipe.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        recipe.difficulty === "easy"
                          ? "bg-green-100 text-green-800"
                          : recipe.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {recipe.difficulty}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2 text-sm text-gray-500">
                      <span>{recipe.prep_time} min prep</span>
                      <span>•</span>
                      <span>{recipe.cook_time} min cook</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditRecipe(recipe)}
                        className="text-orange-600 hover:text-orange-800 
                        text-sm font-medium cursor-pointer py-2 px-4 rounded-md bg-amber-50/70"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteConfirm(recipe.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer py-2 px-4
                        rounded-md bg-rose-200/75
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {deleteConfirm === recipe.id && (
                  <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700">
                        Are you sure you want to delete this recipe?
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(recipe.slug)}
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Confirm Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/*Show edit recipe modal */}

    {editRecipe && (
        <EditRecipeModal
                recipe={editRecipe}
                onUpdate={onUpdate}
                onClose={onClose}
                categories={categories}
    />
    )}
    </div>
  );
};

export default MyRecipesPage;
