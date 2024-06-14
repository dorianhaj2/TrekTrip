package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.model.Country;
import com.trektrip.service.CountryService;
import com.trektrip.service.JwtService;
import com.trektrip.service.UserDetailsServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(CountryController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@ContextConfiguration(classes = {CountryController.class, CountryService.class})
public class CountryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CountryService countryService;
    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private Country country1;
    private Country country2;

    @BeforeEach
    public void setUp() {
        country1 = new Country(1L, "Country1", "Continent1", "Code1");
        country2 = new Country(2L, "Country2", "Continent2", "Code2");
    }

    @Test
    public void testGetAllCountries() throws Exception {
        List<Country> countries = new ArrayList<>();
        countries.add(country1);
        countries.add(country2);

        when(countryService.getAllCountries()).thenReturn(countries);

        mockMvc.perform(MockMvcRequestBuilders.get("/country/all"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(countries.size()));
    }

    @Test
    public void testGetCountryById() throws Exception {
        Long countryId = 1L;

        when(countryService.getCountryById(countryId)).thenReturn(Optional.of(country1));

        mockMvc.perform(MockMvcRequestBuilders.get("/country/{id}", countryId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(countryId));
    }

    @Test
    public void testCreateCountry() throws Exception {
        when(countryService.createCountry(any(Country.class))).thenReturn(country1);

        mockMvc.perform(MockMvcRequestBuilders.post("/country")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(country1)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value(country1.getName()));
    }

    @Test
    public void testUpdateCountry() throws Exception {
        Long countryId = 1L;
        Country updatedCountry = new Country(countryId, "UpdatedCountry", "UpdatedContinent", "UpdatedCode");

        when(countryService.updateCountry(any(Country.class), any(Long.class))).thenReturn(updatedCountry);

        mockMvc.perform(MockMvcRequestBuilders.put("/country/{id}", countryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedCountry)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(countryId));
    }

    @Test
    public void testDeleteCountry() throws Exception {
        Long countryId = 1L;

        mockMvc.perform(MockMvcRequestBuilders.delete("/country/{id}", countryId))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
