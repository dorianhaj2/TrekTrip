package com.trektrip.service;

import com.trektrip.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    User createUser(User user);
    User updateUser(User user, Long id);
    void deleteUser(Long id);
}
