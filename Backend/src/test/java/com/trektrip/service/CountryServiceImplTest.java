package com.trektrip.service;

import com.trektrip.model.Country;
import com.trektrip.repository.CountryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CountryServiceImplTest {

    @Mock
    private CountryRepository countryRepository;

    @InjectMocks
    private CountryServiceImpl countryService;

    @Test
    public void testCreateCountry() {
        Country country = new Country(1L, "Country1", "Continent1", "Code1");

        when(countryRepository.save(Mockito.any(Country.class))).thenReturn(country);

        Country savedCountry = countryService.createCountry(country);

        Assertions.assertNotNull(savedCountry);
    }

    @Test
    public void testGetAllCountries() {
        Country country1 = new Country(1L, "Country1", "Continent1", "Code1");
        Country country2 = new Country(2L, "Country2", "Continent2", "Code2");

        List<Country> allCountries = List.of(country1, country2);

        when(countryRepository.findAll()).thenReturn(allCountries);

        List<Country> countries = countryService.getAllCountries();

        Assertions.assertNotNull(countries);
        Assertions.assertEquals(2, countries.size());
    }

    @Test
    public void testCountryByIdExists() {
        Long id = 1L;
        Country country = new Country(id, "Country1", "Continent1", "Code1");
        when(countryRepository.findById(id)).thenReturn(Optional.of(country));

        Optional<Country> countryReturn = countryService.getCountryById(id);

        Assertions.assertTrue(countryReturn.isPresent());
    }

    @Test
    public void testCountryByIdDoesntExist() {
        Long id = 2L;
        when(countryRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Country> countryReturn = countryService.getCountryById(id);

        Assertions.assertTrue(countryReturn.isEmpty());
    }

    @Test
    public void testUpdateCountry() {
        Long id = 1L;
        Country existingCountry = new Country(id, "Country1", "Continent1", "Code1");
        Country updatedCountry = new Country(id, "UpdatedCountry", "UpdatedContinent", "UpdatedCode");

        when(countryRepository.findById(id)).thenReturn(Optional.of(existingCountry));
        when(countryRepository.save(updatedCountry)).thenReturn(updatedCountry);

        Country updatedCountryReturn = countryService.updateCountry(updatedCountry, id);

        Assertions.assertNotNull(updatedCountryReturn);
        Assertions.assertEquals(updatedCountry.getName(), updatedCountryReturn.getName());
    }

    @Test
    public void testUpdateCountryIfDoesntExist() {
        Long id = 3L;
        Country updatedCountry = new Country(2L, "UpdatedCountry", "UpdatedContinent", "UpdatedCode");

        when(countryRepository.findById(id)).thenReturn(Optional.empty());

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            countryService.updateCountry(updatedCountry, id);
        });
    }

    @Test
    public void testDeleteCountry() {
        Long id = 1L;

        countryService.deleteCountry(id);

        verify(countryRepository).deleteById(id);
    }
}
