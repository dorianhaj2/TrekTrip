import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance'; 

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '', 
    username: '',
    description: '',
    image: null
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
        Korisničko ime:
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
      </label>
      <label>
        Opis:
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </label>
      <label>
        Profilna slika:
        <input type="file" name="image" onChange={handleImageChange} />
      </label>
      <button type="submit">Uredi profil</button>
    </form>
  );
};

export default UpdateProfile;
