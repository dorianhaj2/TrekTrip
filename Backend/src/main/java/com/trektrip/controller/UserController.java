package com.trektrip.controller;

import com.trektrip.model.Image;
import com.trektrip.model.UserInfo;
import com.trektrip.service.ImageService;
import com.trektrip.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {

    private UserService userService;
    private PasswordEncoder passwordEncoder;
    private final ImageService imageService; // Inject ImageService


    @GetMapping("/all")
    public ResponseEntity<List<UserInfo>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserInfo> getUserById(@PathVariable Long id) {
        Optional<UserInfo> optionalUser = userService.getUserById(id);
        if (optionalUser.isPresent()) {
            return ResponseEntity.ok(optionalUser.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserInfo> createUser(@RequestBody UserInfo user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserInfo> updateUser(@PathVariable Long id,
                                               @RequestParam(value = "file", required = false) MultipartFile file,
                                               @ModelAttribute UserInfo updatedUserInfo,
                                               @RequestParam(value = "username", required = false) String username,
                                               @RequestParam(value = "description", required = false) String description) {
        try {
            // Retrieve the existing user data from the database
            Optional<UserInfo> existingUserOptional = userService.getUserById(id);

            // Check if the user exists
            if (existingUserOptional.isPresent()) {
                // Get the UserInfo object from the Optional
                UserInfo existingUserInfo = existingUserOptional.get();

                // Check if a new file is provided and handle it if necessary
                if (file != null && !file.isEmpty()) {
                    // Handle the file upload if needed
                    // For simplicity, let's assume you have a method in ImageService to handle image uploads
                    //Image updatedImage = imageService.handleImageUpload(file);
                    // Associate the updated image with the user
                    //existingUserInfo.setImage(updatedImage);
                }

                // Update the user only if the new values are provided
                if (username != null) {
                    existingUserInfo.setUsername(username);
                }
                if (description != null) {
                    existingUserInfo.setDescription(description);
                }

                // Update the user
                UserInfo updatedUser = userService.updateUser(existingUserInfo, id);
                return new ResponseEntity<>(updatedUser, HttpStatus.OK);
            } else {
                // User with the specified ID does not exist
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Handle other exceptions if necessary
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
