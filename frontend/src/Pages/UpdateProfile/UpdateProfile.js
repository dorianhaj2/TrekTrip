import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import './UpdateProfile.css';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: '',
    description: '',
    image: null,
    imageId: null
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
        let profileData = {};
        let imageId;
        if (formData.image) {
            const imageFormData = new FormData();
            imageFormData.append('file', formData.image);

            const imageRes = await axiosInstance.post('/image', imageFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            imageId = imageRes.data.id;
            /*setFormData(prevFormData => ({ ...prevFormData, imageId }));

            profileData.imageId = imageId;*/
            console.log(imageId)
        }

        if (formData.username) {
            profileData.username = formData.username;
        }
        if (formData.description) {
            profileData.description = formData.description;
        }
        const userData = {
          ...profileData,
          image: {id: imageId},
        };
        const res = await axiosInstance.put(`/user/${userId}`, userData);
        console.log('User updated:', res.data);

        if (formData.username) {
            localStorage.setItem('username', formData.username);
        }

        // navigate('/profile');
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
