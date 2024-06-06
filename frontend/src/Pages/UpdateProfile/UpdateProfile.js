import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import './UpdateProfile.css'

const UpdateProfile = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();

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

      if (formData.username) {
        localStorage.setItem('username', formData.username);
      }

      navigate('/profil');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div>
      <Helmet>
        <title>{t('sitenames.editProfile')}</title>
      </Helmet>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
        {t('editProfile.username')}
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <label>
        {t('editProfile.description')}
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label>
        <label>
        {t('editProfile.profile-photo')}
          <input type="file" name="image" onChange={handleImageChange} />
        </label>
        <button type="submit">{t('editProfile.editButton')}</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
