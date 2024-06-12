package com.trektrip.service;

import com.trektrip.model.Image;
import com.trektrip.repository.ImageRepository;
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
class ImageServiceImplTest {
    @Mock
    private ImageRepository imageRepository;

    @InjectMocks
    private ImageServiceImpl imageService;

    @Test
    public void testCreateImage() {
        Image image = new Image(1L, "url1");

        when(imageRepository.save(Mockito.any(Image.class))).thenReturn(image);

        Image savedImage = imageService.createImage(image);

        Assertions.assertNotNull(savedImage);

    }

    @Test
    public void testGetAllImages() {
        Image image1 = new Image(1L, "url1");
        Image image2 = new Image(2L, "url2");

        List<Image> allImages = List.of(image1, image2);

        when(imageRepository.findAll()).thenReturn(allImages);

        Assertions.assertNotNull(imageRepository.findAll());
    }

    @Test
    public void testImageByIdExists() {
        Long id = 1L;
        Image image = new Image(1L, "url1");
        when(imageRepository.findById(id)).thenReturn(Optional.of(image));

        Optional<Image> imageReturn = imageService.getImageById(id);

        Assertions.assertNotNull(imageReturn.get());
    }

    @Test
    public void testImageByIdDoesntExist() {
        Long id = 2L;
        when(imageRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Image> imageReturn = imageService.getImageById(id);

        Assertions.assertTrue(imageReturn.isEmpty());
    }

    @Test
    public void testUpdateImage() {
        Long id = 1L;
        Image image1 = new Image(1L, "url1");
        Image image2 = new Image(2L, "url2");

        when(imageRepository.findById(id)).thenReturn(Optional.of(image1));
        when(imageRepository.save(image2)).thenReturn(image2);

        Image updateReturn = imageService.updateImage(image2, id);

        Assertions.assertNotNull(updateReturn);
    }

    @Test
    public void testUpdateImageIfDoesntExist() {
        Long id = 3L;
        Image image2 = new Image(2L, "url2");

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            Image updatedImage = imageService.updateImage(image2, id);
        });
    }

    @Test
    public void testDeleteImage() {
        Long id = 1L;

        imageRepository.deleteById(id);
        verify(imageRepository).deleteById(id);
    }
}