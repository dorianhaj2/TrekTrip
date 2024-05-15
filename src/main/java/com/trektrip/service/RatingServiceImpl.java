package com.trektrip.service;

import com.trektrip.model.Rating;
import com.trektrip.repository.RatingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class RatingServiceImpl implements RatingService{

    private RatingRepository ratingRepository;

    @Override
    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    @Override
    public Optional<Rating> getRatingById(Long id) {
        return ratingRepository.findById(id);
    }

    @Override
    public Rating createRating(Rating rating) {
        return ratingRepository.save(rating);
    }

    @Override
    public Rating updateRating(Rating rating, Long id) {
        Optional<Rating> optionalRating = ratingRepository.findById(id);

        if (optionalRating.isPresent()) {
            rating.setId(id);
            return ratingRepository.save(rating);
        } else {
            throw new EntityNotFoundException("Rating with ID = '" + id + "' not found!");
        }
    }

    @Override
    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }
    
}
