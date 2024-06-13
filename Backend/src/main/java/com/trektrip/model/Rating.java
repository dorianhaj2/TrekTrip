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

    public Rating(Long id, int rating) {
        this.id = id;
        this.rating = rating;
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
