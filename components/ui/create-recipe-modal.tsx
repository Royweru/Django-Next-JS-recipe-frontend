import { ACCESS_TOKEN } from '@/constants';
import axios from 'axios';
import React,{useState} from 'react'

export const CreateRecipeModal = ({
    categories,setShowAddRecipe
}:{
    categories:CategoryType[],
    setShowAddRecipe:(show:boolean)=>void
}) => {
   const [recipeForm, setRecipeForm] = useState<{
    title: string;
    category: string;
    description: string;
    ingredients: string;
    instructions: string;
    tips?: string;
    prep_time: string;
    cook_time: string;
    total_time: string;
    difficulty: string;
    featured_image: File | null;
    is_published:true
  }>({
    title: "",
    category: "",
    description: "",
    ingredients: "",
    instructions: "",
    tips: "",
    prep_time: '',
    cook_time: '',
    total_time: '',
    difficulty: "easy",
    featured_image: null,
    is_published:true
  });
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const handleAddRecipe = async () => {
    try {
      setIsUploading(true);  
      const formData = new FormData();
      formData.append('title', recipeForm.title);
      formData.append('description', recipeForm.description);
      formData.append('category', recipeForm.category);
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

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/recipes/create/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        }
      });

      // Handle success
      console.log('Recipe created:', response.data);
      setShowAddRecipe(false);
      alert("Recipe created successfully")
      window.location.reload()

    } catch (error) {
      console.error('Error creating recipe:', error);
    } finally {
      setIsUploading(false);
    }
  };
  return (
   <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Recipe</h2>
                <p className="text-gray-600">Share your culinary creation with the world</p>
              </div>
              <button
                onClick={() => setShowAddRecipe(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Title Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Title</label>
                <input
                  type="text"
                  placeholder="What's the name of your delicious creation?"
                  value={recipeForm.title}
                  onChange={(e) => setRecipeForm({...recipeForm, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                  required
                />
              </div>

               {/* Image upload field*/}
                 <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Featured Image
              </span>
            </label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-1/3">
                <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
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
                    <span className="font-medium text-gray-700">Click to upload</span>
                    <span className="text-xs text-gray-500">or drag and drop</span>
                    <span className="text-xs text-gray-400">JPG, PNG (max. 5MB)</span>
                  </div>
                </label>
                {recipeForm.featured_image && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {recipeForm.featured_image.name}
                  </div>
                )}
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
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Category
                    </span>
                  </label>
                  <select
                    value={recipeForm.category}
                    onChange={(e) => setRecipeForm({...recipeForm, category: e.target.value})}
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
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      Difficulty
                    </span>
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
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Prep Time (minutes)
                    </span>
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
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 010 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 010 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h6a1 1 0 010 2H4a1 1 0 01-1-1z" />
                        <path d="M13 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zM17 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" />
                      </svg>
                      Cook Time (minutes)
                    </span>
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
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ingredients
                  </span>
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
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Instructions
                  </span>
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
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Pro Tips <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                  </span>
                </label>
                <textarea
                  placeholder="Share your secret tips and tricks that make this recipe extraordinary..."
                  value={recipeForm.tips}
                  onChange={(e) => setRecipeForm({...recipeForm, tips: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
           <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={handleAddRecipe}
            disabled={isUploading}
            className={`flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Recipe
              </>
            )}
          </button>
          <button
            onClick={() => setShowAddRecipe(false)}
            disabled={isUploading}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
        </div>

  )
}