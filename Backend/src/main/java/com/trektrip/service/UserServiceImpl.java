package com.trektrip.service;

import com.trektrip.model.UserInfo;
import com.trektrip.model.UserRole;
import com.trektrip.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    @Override
    public List<UserInfo> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<UserInfo> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public UserInfo createUser(UserInfo user) {
        if (user.getRoles() == null) {
            user.setRoles(new ArrayList<>());
            user.getRoles().add(new UserRole(1L));
        }
        return userRepository.save(user);
    }

    @Override
    public UserInfo updateUser(UserInfo user, Long id) {
        Optional<UserInfo> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            user.setId(id);
            return userRepository.save(user);
        } else {
            throw new EntityNotFoundException("UserInfo with ID = '" + id + "' not found!");
        }
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
