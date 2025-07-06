import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN } from '@/constants';

interface EditRecipeModalProps {
  recipe:RecipeType,
  categories: CategoryType[];
  onClose: () => void;
  onUpdate: (updatedRecipe: any) => void;
}

export const EditRecipeModal: React.FC<EditRecipeModalProps> = ({ 
  recipe, 
  categories, 
  onClose, 
  onUpdate 
}) => {
  const [recipeForm, setRecipeForm] = useState({
    title: recipe.title,
    category: recipe.category.id,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    tips: recipe.tips || '',
    prep_time: recipe.prep_time.toString(),
    cook_time: recipe.cook_time.toString(),
    difficulty: recipe.difficulty,
    featured_image: null as File | null,
    is_published:true,
  });

  const [previewImage, setPreviewImage] = useState(recipe.featured_image || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRecipeForm({...recipeForm, featured_image: file});
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setRecipeForm({...recipeForm, featured_image: null});
    setPreviewImage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', recipeForm.title);
      formData.append('description', recipeForm.description);
      formData.append('category', recipeForm.category.toString());
      formData.append('prep_time', recipeForm.prep_time);
      formData.append('cook_time', recipeForm.cook_time);
      formData.append('difficulty', recipeForm.difficulty);
      formData.append('ingredients', recipeForm.ingredients);
      formData.append('instructions', recipeForm.instructions);
      formData.append('is_published', recipeForm.is_published.toString());
      if (recipeForm.tips) formData.append('tips', recipeForm.tips);
      if (recipeForm.featured_image) {
        formData.append('featured_image', recipeForm.featured_image);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipes/${recipe.slug}/update/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
          }
        }
      );

      onUpdate(response.data);
      onClose();
    } catch (err) {
      setError('Failed to update recipe. Please try again.');
      console.error('Error updating recipe:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Edit Recipe</h2>
            <p className="text-gray-600">Update your culinary creation</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
            disabled={isUpdating}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Title</label>
            <input
              type="text"
              placeholder="Recipe name"
              value={recipeForm.title}
              onChange={(e) => setRecipeForm({...recipeForm, title: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
              required
            />
          </div>
          
          {/* Image Upload */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-1/3">
                <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {previewImage ? (
                    <>
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all"
                      >
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs">No image selected</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 w-full">
                <label className="block w-full px-4 py-10 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-500 transition-colors duration-200 text-center">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium text-gray-700">
                      {previewImage ? 'Change image' : 'Upload image'}
                    </span>
                    <span className="text-xs text-gray-500">JPG, PNG (max. 5MB)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Tell us what makes this recipe special..."
              value={recipeForm.description}
              onChange={(e) => setRecipeForm({...recipeForm, description: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
              rows={3}
              required
            />
          </div>
          
          {/* Category and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={recipeForm.category}
                onChange={(e) => setRecipeForm({...recipeForm, category: Number(e.target.value)})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 bg-white"
                required
              >
                <option value="">Select a category</option>
                {categories.filter(c => c.slug !== 'all').map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={recipeForm.difficulty}
                onChange={(e) => setRecipeForm({...recipeForm, difficulty: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 bg-white"
                required
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
            </div>
          </div>
          
          {/* Timing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                placeholder="15"
                value={recipeForm.prep_time}
                onChange={(e) => setRecipeForm({...recipeForm, prep_time: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                placeholder="30"
                value={recipeForm.cook_time}
                onChange={(e) => setRecipeForm({...recipeForm, cook_time: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                min="1"
                required
              />
            </div>
          </div>
          
          {/* Ingredients */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ingredients
            </label>
            <div className="relative">
              <textarea
                placeholder="• 2 cups all-purpose flour&#10;• 1 tsp baking powder&#10;• 1/2 cup sugar&#10;• 2 large eggs..."
                value={recipeForm.ingredients}
                onChange={(e) => setRecipeForm({...recipeForm, ingredients: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                rows={5}
                required
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                One ingredient per line
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              placeholder="1. Preheat your oven to 350°F (175°C)&#10;2. In a large bowl, whisk together flour and baking powder&#10;3. In another bowl, cream butter and sugar until light and fluffy..."
              value={recipeForm.instructions}
              onChange={(e) => setRecipeForm({...recipeForm, instructions: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
              rows={6}
              required
            />
          </div>
          
          {/* Tips */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pro Tips (Optional)
            </label>
            <textarea
              placeholder="Share your secret tips and tricks..."
              value={recipeForm.tips}
              onChange={(e) => setRecipeForm({...recipeForm, tips: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isUpdating}
              className={`flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Update Recipe
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};