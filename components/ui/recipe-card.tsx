import { Clock, Heart, Star, Trash2 } from 'lucide-react'
import React from 'react'

export const RecipeCard = ({
    recipe,
    handleDeleteRecipe,
    handleToggleFavorite,
    setViewingRecipe,
    user
}:{
    recipe:RecipeType,
    handleDeleteRecipe:(slug:string)=>void,
    setViewingRecipe:(recipe:RecipeType)=>void,
    handleToggleFavorite:(id:number)=>void,
    user:UserType |null
}) => {
   const isFavorite =user ?recipe.favorites.includes(user.id): false
  
  return (
    <div 
      key={recipe.id} 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
      onClick={()=>setViewingRecipe(recipe)}
    >
      {/* Image Section */}
      <div className="relative">
        {recipe.featured_image ? (
          <img 
            src={recipe.featured_image} 
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full h-48 flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title & Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-1">{recipe.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{recipe.description}</p>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 mb-4">
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock size={14} className="text-gray-500" />
            <span className ="text-xs font-medium">{recipe.prep_time + recipe.cook_time} mins</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium">{recipe.average_rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Heart size={14} className="text-red-500" />
            <span className="text-xs font-medium">{recipe.favorite_count}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleToggleFavorite(recipe.id)}
            className={`flex items-center space-x-1 cursor-pointer text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
              isFavorite 
                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                : 'text-gray-600 hover:text-red-500 hover:bg-gray-100'
            }`}
          >
            <Heart size={16} className={isFavorite ? 'fill-red-500' :''} />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>
          
          <button
            onClick={() => setViewingRecipe(recipe)}
            className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:shadow-md transition-all"
          >
            View Recipe
          </button>
        </div>

        {/* Author & Date */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">By {recipe.author}</span>
          <span className="text-xs text-gray-400">
            {new Date(recipe.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  )
}