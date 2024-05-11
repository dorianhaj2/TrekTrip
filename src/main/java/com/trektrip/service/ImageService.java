package com.trektrip.service;

import com.trektrip.model.Image;
import com.trektrip.model.Image;

import java.util.List;
import java.util.Optional;

public interface ImageService {

    List<Image> getAllImages();
    Optional<Image> getImageById(Long id);
    Image createImage(Image image);
    Image updateImage(Image image, Long id);
    void deleteImage(Long id);
    
}
