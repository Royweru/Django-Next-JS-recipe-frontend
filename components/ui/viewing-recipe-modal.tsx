import React, { useState } from 'react';
import { Clock, Star, Heart, User, Send, MessageCircle, X, ChefHat, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { ACCESS_TOKEN } from '@/constants';

export const ViewingRecipeModal = ({
    viewingRecipe,
    setViewingRecipe,
    comments,
    handleToggleFavorite,
    user
}: {
    viewingRecipe: RecipeType 
    setViewingRecipe: (recipe: RecipeType | null) => void;
    comments:RecipeCommentType[],
    handleToggleFavorite:(recipeId: number) => void;
    user : UserType |null
}) => {
  const isFavorite =user ?viewingRecipe.favorites.includes(user.id): false
  const [newComment, setNewComment] = useState('');
  const [ recipeRating, setRecipeRating ] = useState<number>(0);


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          {viewingRecipe.featured_image ? (
            <div className="relative h-64 overflow-hidden">
              <img 
                src={viewingRecipe.featured_image} 
                alt={viewingRecipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewingRecipe(null)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
              >
                <X size={20} />
              </Button>
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{viewingRecipe.title}</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <ChefHat size={12} className="mr-1" />
                    {viewingRecipe.author} 
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Users size={12} className="mr-1" />
                    {comments.length} comments
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 h-64 flex items-center justify-center text-white relative">
              <div className="text-8xl">🍽️</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewingRecipe(null)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
              >
                <X size={20} />
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-[calc(95vh-16rem)]">
          <div className="p-6 space-y-6">
            {/* Recipe Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center border border-blue-200">
                <Clock className="mx-auto mb-2 text-blue-600" size={24} />
                <div className="font-semibold text-blue-900">{viewingRecipe.prep_time + viewingRecipe.cook_time} mins</div>
                <div className="text-xs text-blue-600">Total Time</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl text-center border border-yellow-200">
                <Star className="mx-auto mb-2 text-yellow-600" size={24} />
                <div className="font-semibold text-yellow-900">{viewingRecipe.average_rating.toFixed(1)}/5</div>
                <div className="text-xs text-yellow-600">Rating</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl text-center border border-red-200">
                <Heart className="mx-auto mb-2 text-red-600" size={24} />
                <div className="font-semibold text-red-900">{viewingRecipe.favorite_count}</div>
                <div className="text-xs text-red-600">Favorites</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-gray-700 leading-relaxed">{viewingRecipe.description}</p>
            </div>

            {/* Ingredients */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                Ingredients
              </h3>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="text-gray-700 whitespace-pre-line font-medium">{viewingRecipe.ingredients}</div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                Instructions
              </h3>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">{viewingRecipe.instructions}</div>
              </div>
            </div>

            {/* Tips */}
            {viewingRecipe.tips && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></div>
                  Pro Tips
                </h3>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                  <div className="text-gray-700 font-medium">{viewingRecipe.tips}</div>
                </div>
              </div>
            )}

            <Separator className="my-6" />
              {/* Rate the recipe */ }
         <div className=' space-y-3'>
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Star className="mr-2 text-yellow-600" size={24} />
                Rate this Recipe
              </h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    className="p-2 rounded-full hover:bg-yellow-50 cursor-pointer transition-colors"
                    onClick={() => setRecipeRating(star)}

                  >
                    <div>
                     <Star
                        size={20} 
                        className={`text-yellow-600 ${recipeRating >= star ? 'fill-yellow-600' : 'fill-transparent'}`}
                      />
                    </div>
                  </Button>
                ))}
              </div>
         </div>
            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <MessageCircle className="mr-2 text-purple-600" size={24} />
                  Comments ({comments.length})
                </h3>
              </div>

              {/* Add Comment */}
              <div className="bg-gray-50 p-4 rounded-xl border space-y-3">
                <div className="flex items-center space-x-2">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src="/default-avatar.png" alt="User Avatar" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                          {viewingRecipe.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold text-gray-900">Add a Comment</h4>
                </div>
                <Textarea
                  placeholder="Share your experience with this recipe..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
                <Button 
                  onClick={()=>{}}
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send size={16} className="mr-2" />
                  Post Comment
                </Button>
              </div>

              {/* Comments List */}
              <ScrollArea className="max-h-80">
                <div className="space-y-4 pr-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                            {comment.author.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">{comment.author.username}</h4>
            
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t bg-gray-50 -mx-6 px-6 py-4 mt-6">
              <div className="text-sm text-gray-600">
                Created on {new Date(viewingRecipe.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={()=>handleToggleFavorite(viewingRecipe.id)}
               
              >
                <Heart size={16} className={` ${isFavorite ? 'text-red-600 fill-red-500' : ''}` } />
                {isFavorite ?'Unfavorite' :'Favorite recipe'}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

