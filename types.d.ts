//Types

type UserType = {
  id: number;
  username: string;
  email: string;
  bio?:string;
  profile_picture?: string;
  is_chef_verified:boolean;
  date_joined: string;
  location?:string
  recipes_count: number;
};

type RecipeType = {
  id: number;
  title: string;
  slug: string;
  author:string;
  category:{
    id:number,
    name:string,
    slug:string
  };
  description: string;
  ingredients: string;
  instructions: string;
  tips?: string;
  prep_time: number;
  cook_time: number;
  total_time: number;
  difficulty: string;
  comments:RecipeCommentType[];
  favorites:any[];
  is_published: boolean;
  is_featured: boolean;
  is_favorited:boolean;
  average_rating: number;
  favorite_count: number;
  featured_image: string;
  created_at: string;
};

type CategoryType = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image: string;
  recipes_count: number;
  created_at: string;
};

type RecipeCommentType = {
    id: number;
    author:UserType;
    is_approved:boolean;
    recipe:string;
    parent:any;
    content: string;
    created_at: string;
    replies: RecipeCommentType[];
}