// src/Components/StarRating/StarRating.js

import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const StarRating = ({ rating }) => {
  return (
    <Stack spacing={1}>
      <Rating className="rating" name="half-rating-read" value={rating} precision={0.1} />
    </Stack>
  );
};

export default StarRating;
