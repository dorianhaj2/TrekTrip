package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.model.Country;
import com.trektrip.service.CountryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(CountryController.class)
public class CountryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CountryService countryService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllCountries() throws Exception {
        List<Country> countries = new ArrayList<>();
        countries.add(new Country(1L, "Country1", "Continent1", "Code1"));
        countries.add(new Country(2L, "Country2", "Continent2", "Code2"));

        when(countryService.getAllCountries()).thenReturn(countries);

        mockMvc.perform(MockMvcRequestBuilders.get("/country/all"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray());
    }

    @Test
    public void testGetCountryById() throws Exception {
        Long countryId = 1L;
        Country country = new Country(countryId, "Country1", "Continent1", "Code1");

        when(countryService.getCountryById(countryId)).thenReturn(Optional.of(country));

        mockMvc.perform(MockMvcRequestBuilders.get("/country/{id}", countryId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(countryId));
    }

    @Test
    public void testCreateCountry() throws Exception {
        Country country = new Country(1L, "Country1", "Continent1", "Code1");

        when(countryService.createCountry(any(Country.class))).thenReturn(country);

        mockMvc.perform(MockMvcRequestBuilders.post("/country")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(country)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value(country.getName()));
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
