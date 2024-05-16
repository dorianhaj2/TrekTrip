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
    private Integer country_id;
//    private Integer pin_id;
    @OneToOne
    @JoinColumn(name = "pin_ID", referencedColumnName = "id")
    private Pin pin;
}

//One to many primjer na 25:48