package com.trektrip.service;

import com.trektrip.model.Image;
import com.trektrip.repository.ImageRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;

@Service
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    @Value("${upload.path}")
    private String uploadPath; // Path to directory where images will be stored

    public ImageServiceImpl(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @Override
    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    @Override
    public Optional<Image> getImageById(Long id) {
        return imageRepository.findById(id);
    }

    @Override
    public Image createImage(Image image) {
        return imageRepository.save(image);
    }

    @Override
    public Image updateImage(Image image, Long id) {
        Optional<Image> optionalImage = imageRepository.findById(id);

        if (optionalImage.isPresent()) {
            image.setId(id);
            return imageRepository.save(image);
        } else {
            throw new EntityNotFoundException("Image with ID = '" + id + "' not found!");
        }
    }

    @Override
    public void deleteImage(Long id) {
        imageRepository.deleteById(id);
    }

    @Override
    public Image handleImageUpload(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString(); // Generate a unique filename
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String filePath = uploadPath + File.separator + filename + fileExtension;
        Path destination = Paths.get(filePath);
        Files.copy(file.getInputStream(), destination);

        String imageUrl = "/uploads/" + filename + fileExtension; // URL to access the image
        Image image = new Image();
        image.setUrl(imageUrl);

        return imageRepository.save(image);
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return filename.substring(lastDotIndex);
        }
        return "";
    }
}
