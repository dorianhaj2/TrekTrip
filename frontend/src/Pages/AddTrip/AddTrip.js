import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import tripService from '../../Services/tripService';
import { useTranslation } from 'react-i18next';
import './AddTrip.css';

const AddTrip = () => {
  const {t} = useTranslation();

  const months = t('months', { returnObjects: true });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lengthInDays: '',
    price: '',
    tripMonth: '',
    isPublic: false,
  });

  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');

    try {
      const tripData = {
        ...formData,
        user: userId,
      };
      const response = await tripService.createTrip(tripData);
      console.log('Trip added successfully:', response.data);
      navigate('/trips'); 
    } catch (error) {
      console.error('Adding trip failed:', error);
      setError('Failed to add trip. Please try again later.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="auth-container">
      <Helmet>
        <title>{t('sitenames.addTrip')}</title>
      </Helmet>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">{t('addTrip.title')}</h1>
        <label>
          {t('addTrip.name')}
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>
        <label>
          {t('addTrip.description')}
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <label>
          {t('addTrip.length')}
          <input type="number" name="lengthInDays" value={formData.lengthInDays} onChange={handleChange} required />
        </label>
        <label>
          {t('addTrip.price')}
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </label>
        <label>
          {t('addTrip.month')}
          <select name="tripMonth" value={formData.tripMonth} onChange={handleChange} required>
            <option value="">{t('addTrip.chooseMonth')}</option>
            {months.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
        </label>
        <label>
          Javno
          <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} />
        </label>
        <button type="submit" className="auth-submit" disabled={adding}>
          {adding ? 'Dodavanje...' : 'Dodaj Putovanje'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default AddTrip;
