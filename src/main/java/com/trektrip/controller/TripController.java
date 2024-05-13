package com.trektrip.controller;

import com.trektrip.model.Trip;
import com.trektrip.service.TripService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/trip")
public class TripController {

    private TripService tripService;

    @GetMapping("/all")
    public ResponseEntity<List<Trip>> getAllTrip() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        Optional<Trip> optionaltrip = tripService.getTripById(id);
        if (optionaltrip.isPresent()) {
            return ResponseEntity.ok(optionaltrip.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        return new ResponseEntity<>(tripService.createTrip(trip), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@RequestBody Trip trip, @PathVariable Long id) {
        try {
            Trip updatedTrip = tripService.updateTrip(trip, id);
            return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
    
}
