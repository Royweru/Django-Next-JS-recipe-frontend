import React, { useState } from 'react';


interface UserProfileModalProps {
  userData: UserType | null;
setShowUserProfile: (open:boolean) => void;
  onSave: (updatedData: Partial<UserType>) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userData,
setShowUserProfile,
  onSave,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: userData?.bio || '',
    location: userData?.location || '',
    profile_picture: userData?.profile_picture || '',
  });

  if (!userData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profile_picture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <h2 className="text-xl font-bold">User Profile</h2>
          <button 
            onClick={()=>setShowUserProfile(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <img
                src={formData.profile_picture || '/default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  ✏️
                </label>
              )}
            </div>

            <h3 className="text-xl font-semibold">{userData.username}</h3>
            <p className="text-gray-500">{userData.email}</p>
            <div className="mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {userData.recipes_count} recipes
            </div>
            {userData.is_chef_verified && (
              <div className="mt-1 flex items-center text-green-600">
                <span className="mr-1">✓</span> Verified Chef
              </div>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Where are you from?"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-500">Bio</h4>
                <p className="mt-1 text-gray-700">
                  {formData.bio || 'No bio provided'}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500">Location</h4>
                <p className="mt-1 text-gray-700">
                  {formData.location || 'No location set'}
                </p>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};