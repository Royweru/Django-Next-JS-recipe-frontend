"use client";
import { AuthModal } from "@/components/ui/auth-modal";
import { CreateRecipeModal } from "@/components/ui/create-recipe-modal";
import { Navbar } from "@/components/ui/navbar";
import { RecipeCard } from "@/components/ui/recipe-card";
import { UserProfileModal } from "@/components/ui/user-profile-modal";
import { ViewingRecipeModal } from "@/components/ui/viewing-recipe-modal";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import axios from "axios";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
export default function Home() {
  const [user, setUser] = useState<UserType | null>(null);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | number>(
    "all"
  );

  //Modal states

  const [showAuth, setShowAuth] = useState(false);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [loadingRecipes, setLoadingRecipes]= useState(false);
  const [viewingRecipe, setViewingRecipe] = useState<RecipeType | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoadingRecipes(true)
        const res = await axios.get<RecipeType[]>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipes/`,
          {
            params: {
              search: searchTerm,
              category:
                selectedCategory !== "all" ? selectedCategory : undefined,
            },
          }
        );
        setRecipes(res.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }finally{
        setLoadingRecipes(false)
      }
    };

    fetchRecipes();
  }, [searchTerm, selectedCategory]);
  useEffect(() => {
    fetchCategories();
    fetchUser();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get<CategoryType[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/`
      );
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  const fetchUser = async () => {
    try {
   
         const res = await axios.get<UserType>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );
      setUser(res.data);
    
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const onSaveProfile = async(formData: Partial<UserType>) => {
      try {
      const res = await axios.post<UserType>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );
      if (res.data) {
        setShowUserProfile(false);
        window.location.reload();
        //Show a success toast
      }
    } catch (error) {
      console.error("Error updating user profile : ", error);
    }
  };
 
  const handleLogout = () => {
      localStorage.removeItem(ACCESS_TOKEN)
      localStorage.removeItem(REFRESH_TOKEN)
      setUser(null)
      setShowAddRecipe(false)
      setViewingRecipe(null)
      setShowUserProfile(false)
  };

  const handleToggleFavorite  =async (recipeId:number) => {
     if(!recipeId) return
     if(!user){
      alert("Login to be able to favorite recipe")
      return
     }
     try {
       const res= await axios.post( `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipes/${recipeId}/favorite/`,{},{
        headers:{
          'Content-Type':'application/json',
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        }
       })
       if(res.data.favorited){
        alert("You have successfully favorited the recipe")
       }else{
        alert("You have unfavorited the recipe")
       }
     } catch (error) {
       console.error("Error while favorting recipe",error)
     }
  };
  const handleDeleteRecipe  = async(slug:string) => {
    try{
       const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipes/${slug}/favorite/`
      );
      if (res.status === 200) {
        window.location.reload();
        setViewingRecipe(null);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }


  };
  console.log("Available recipes : ",recipes);

  return (
    <div className=" min-h-screen bg-gray-50">
      <Navbar
        handleLogout={handleLogout}
        setShowAddRecipe={setShowAddRecipe}
        setShowAuth={setShowAuth}
        user={user}
        setShowUserProfile={setShowUserProfile}
      />
      <main className=" max-w-6xl  mx-auto px-4 py-8">
         <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">
                 All
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}{" "}
                  {category.recipes_count > 0 && `(${category.recipes_count})`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div >
          {
            loadingRecipes &&(
              <>
                <div className=" w-full py-14 flex items-center justify-center">
                     <div className=" space-y-4">
                         <h4 className=" font-bold text-4xl">
                          Loading recipes
                         </h4>
                        <div className="flex justify-center">
                          <svg
                            className="animate-spin h-10 w-10 text-orange-500 mx-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        </div>
                     </div>
                </div>
              </>
            )
          }
          {recipes.length===0 &&!loadingRecipes && (
              <>
                <h2 className=" text-2xl font-bold text-neutral-900 mb-4">
                    No recipes were found
                </h2>
                <p className=" text-gray-600">
                 No recipes matching the search criteria . Try another search or add a new recipe
                </p>
              </>
          )}
          
          {
            recipes &&!loadingRecipes && (
                  <>
            <h2 className=" text-3xl font-bold text-neutral-900 mb-4">
                  Recipes
            </h2>
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {recipes.map(recipe=>(
                   <RecipeCard
                    key={recipe.id}  
                   user={user}
                     recipe={recipe}
                     setViewingRecipe={setViewingRecipe}
                     handleDeleteRecipe={handleDeleteRecipe}
                     handleToggleFavorite={handleToggleFavorite}
                   />
                ))}
            </div>
           </>
            )
          }
       
        
        </div>
      </main>
      {/* Show Auth Modal */}
      {showAuth && (
        <AuthModal
          setShowAuth={setShowAuth}
          setShowUserProfile={setShowAddRecipe}
        />
      )}
      {showUserProfile && (
        <UserProfileModal
          onSave={onSaveProfile}
          setShowUserProfile={setShowUserProfile}
          userData={user}
        />
      )}
      {
       viewingRecipe && (
        <ViewingRecipeModal
          comments={viewingRecipe.comments}
          setViewingRecipe={setViewingRecipe}
          user={user}
          handleToggleFavorite={handleToggleFavorite}
          viewingRecipe={viewingRecipe}
        />
      )
      }
      {
        showAddRecipe  &&(
          <CreateRecipeModal
            categories={categories}
            setShowAddRecipe={setShowAddRecipe}
          />
        )
      }
     
    </div>
  );
}
