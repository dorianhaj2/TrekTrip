import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance'; // Adjust the path as necessary

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '', // Assuming you have the user's ID
    username: '',
    description: '',
    image: null // Assuming you're uploading an image
  });

  const userId = localStorage.getItem('userId');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      if (formData.username) {
        formDataToSend.append('username', formData.username);
      }
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const res = await axiosInstance.put(`/user/${userId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('User updated:', res.data);
      // Optionally, you can handle success or update UI accordingly

      // Update the local storage username if it was changed
      if (formData.username) {
        localStorage.setItem('username', formData.username);
      }

      navigate('/profil');
    } catch (error) {
      console.error('Error updating user:', error);
      // Optionally, you can handle errors or update UI accordingly
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <label>
        Username:
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </label>
      <label>
        Profile Image:
        <input type="file" name="image" onChange={handleImageChange} />
      </label>
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UpdateProfile;
