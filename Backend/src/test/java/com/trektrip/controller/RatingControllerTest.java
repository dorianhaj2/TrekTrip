package com.trektrip.controller;

import com.trektrip.dto.RatingRequestDTO;
import com.trektrip.model.Rating;
import com.trektrip.model.Trip;
import com.trektrip.model.UserInfo;
import com.trektrip.service.RatingService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
public class RatingControllerTest {

    @Mock
    private RatingService ratingService;

    @InjectMocks
    private RatingController ratingController;

    private Rating rating;
    private Long ratingId;
    private Trip trip;
    private UserInfo user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ratingId = 1L;
        Trip trip = new Trip();
        UserInfo user = new UserInfo();
        rating = new Rating(ratingId, trip, 4.5, user);
    }

    @Test
    public void testGetAllRatings() {
        // Arrange
        List<Rating> allRatings = Arrays.asList(rating);
        given(ratingService.getAllRatings()).willReturn(allRatings);

        // Act
        ResponseEntity<List<Rating>> response = ratingController.getAllRating();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(allRatings, response.getBody());
    }

    @Test
    public void testGetRatingByIdFound() {
        // Arrange
        given(ratingService.getRatingById(ratingId)).willReturn(Optional.of(rating));

        // Act
        ResponseEntity<Rating> response = ratingController.getRatingById(ratingId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(rating, response.getBody());
    }

    @Test
    public void testGetRatingByIdNotFound() {
        // Arrange
        given(ratingService.getRatingById(ratingId)).willReturn(Optional.empty());

        // Act
        ResponseEntity<Rating> response = ratingController.getRatingById(ratingId);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    public void testCreateRating() {
        // Arrange
        RatingRequestDTO ratingRequestDTO = new RatingRequestDTO();
        ratingRequestDTO.setRating(4.5);
        ratingRequestDTO.setTripId(trip.getId());
        ratingRequestDTO.setUserId(user.getId());

        given(ratingService.createRating(any(Rating.class))).willReturn(rating);

        // Act
        ResponseEntity<Rating> response = ratingController.createRating(ratingRequestDTO);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(rating, response.getBody());
    }

    @Test
    public void testUpdateRatingSuccess() {
        // Arrange
        given(ratingService.updateRating(any(Rating.class), eq(ratingId))).willReturn(rating);

        // Act
        ResponseEntity<Rating> response = ratingController.updateRating(rating, ratingId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(rating, response.getBody());
    }

    @Test
    public void testUpdateRatingNotFound() {
        // Arrange
        willThrow(new EntityNotFoundException()).given(ratingService).updateRating(any(Rating.class), eq(ratingId));

        // Act
        ResponseEntity<Rating> response = ratingController.updateRating(rating, ratingId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testDeleteRating() {
        // Arrange
        willDoNothing().given(ratingService).deleteRating(ratingId);

        // Act
        ResponseEntity<Void> response = ratingController.deleteRating(ratingId);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}