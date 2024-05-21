package com.trektrip.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String city;
    @OneToOne
    @JoinColumn(name = "country_id", referencedColumnName = "id")
    private Country country;
    @OneToOne
    @JoinColumn(name = "pin_ID", referencedColumnName = "id")
    private Pin pin;
}