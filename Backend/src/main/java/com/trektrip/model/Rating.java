package com.trektrip.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserInfo user;

    @ManyToOne
    @JoinColumn(name = "trip_id", referencedColumnName = "id")
    private Trip trip;

    private int rating;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Rating rating1 = (Rating) o;
        return rating == rating1.rating && Objects.equals(id, rating1.id) && Objects.equals(user, rating1.user) && Objects.equals(trip, rating1.trip);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, trip, rating);
    }

    public int compareTo(Rating rating2) {
        return Integer.compare(getRating(), rating2.getRating());
    }

    @Override
    public String toString() {
        return "Rating{" +
                "id=" + id +
                ", userId=" + user.getId() +
                ", tripId=" + trip.getId() +
                ", rating=" + rating +
                '}';
    }
}
