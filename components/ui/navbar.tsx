import { ChefHat, LogIn, LogOut, Plus } from 'lucide-react'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu'
import { Button } from './button'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import Link from 'next/link'

export const Navbar = ( 
    {
     user,
     handleLogout,
     setShowAddRecipe,
     setShowAuth,
     setShowUserProfile
    }:{
    user:UserType| null,
    setShowAddRecipe:(show:boolean)=>void,
    setShowAuth:(show:boolean)=>void,
    handleLogout : () =>void,
    setShowUserProfile :(show:boolean)=>void,
    }
) => {
  return (
<header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="text-orange-500" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">RecipeShare</h1>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => setShowAddRecipe(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Recipe</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">
                      Hello, {user.username}!
                    </span>
                    <DropdownMenu >
                      <DropdownMenuTrigger>
                        <Button variant={'ghost'}>
                          <Avatar>
                             <AvatarImage src={user.profile_picture} alt='User profile picture'/>
                             <AvatarFallback className=' text-white font-black 
                          bg-gradient-to-bl from-purple-100 to-indigo-300'>
                                 {user.username.charAt(0).toUpperCase()}
                                 {user.username.charAt(1).toUpperCase()}
                             </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className=' w-64'>
                          <DropdownMenuItem >
                            <Link href={'/my-recipes'}>
                             My recipes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                           onClick={()=>setShowUserProfile(true)}
                          >
                            Edit profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className='my-2.5'></DropdownMenuSeparator>
                          <DropdownMenuItem
                           onClick={handleLogout}
                          >
                             Logout
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
  )
}
