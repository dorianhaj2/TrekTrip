package com.trektrip.controller;

import com.trektrip.model.Rating;
import com.trektrip.service.RatingService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/rating")
public class RatingController {

    private RatingService ratingService;

    @GetMapping("/all")
    public ResponseEntity<List<Rating>> getAllRating() {
        return ResponseEntity.ok(ratingService.getAllRatings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rating> getRatingById(@PathVariable Long id) {
        Optional<Rating> optionalrating = ratingService.getRatingById(id);
        if (optionalrating.isPresent()) {
            return ResponseEntity.ok(optionalrating.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping
    public ResponseEntity<Rating> createRating(@RequestBody Rating rating) {
        return new ResponseEntity<>(ratingService.createRating(rating), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rating> updateRating(@RequestBody Rating rating, @PathVariable Long id) {
        try {
            Rating updatedRating = ratingService.updateRating(rating, id);
            return new ResponseEntity<>(updatedRating, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
        return ResponseEntity.noContent().build();
    }
    
}
