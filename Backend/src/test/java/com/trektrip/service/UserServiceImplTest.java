package com.trektrip.service;

import com.trektrip.model.UserInfo;
import com.trektrip.repository.UserRepository;
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
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    public void testCreateUser() {
        UserInfo user = new UserInfo(1L, "user1", "user1@mail.com", "pass1");

        when(userRepository.save(Mockito.any(UserInfo.class))).thenReturn(user);

        UserInfo savedUser = userService.createUser(user);

        Assertions.assertNotNull(savedUser);

    }

    @Test
    public void testGetAllUsers() {
        UserInfo user1 = new UserInfo(1L, "user1", "user1@mail.com", "pass1");
        UserInfo user2 = new UserInfo(2L, "user2", "user2@mail.com", "pass2");

        List<UserInfo> allUsers = List.of(user1, user2);

        when(userRepository.findAll()).thenReturn(allUsers);

        Assertions.assertNotNull(userRepository.findAll());
    }

    @Test
    public void testUserByIdExists() {
        Long id = 1L;
        UserInfo user = new UserInfo(1L, "user1", "user1@mail.com", "pass1");
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        Optional<UserInfo> userReturn = userService.getUserById(id);

        Assertions.assertNotNull(userReturn.get());
    }

    @Test
    public void testUserByIdDoesntExist() {
        Long id = 2L;
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        Optional<UserInfo> userReturn = userService.getUserById(id);

        Assertions.assertTrue(userReturn.isEmpty());
    }

    @Test
    public void testUpdateUser() {
        Long id = 1L;
        UserInfo user1 = new UserInfo(1L, "user1", "user1@mail.com", "pass1");
        UserInfo user2 = new UserInfo(2L, "user2", "user2@mail.com", "pass2");

        when(userRepository.findById(id)).thenReturn(Optional.of(user1));
        when(userRepository.save(user2)).thenReturn(user2);

        UserInfo updateReturn = userService.updateUser(user2, id);

        Assertions.assertNotNull(updateReturn);
    }

    @Test
    public void testUpdateUserIfDoesntExist() {
        Long id = 3L;
        UserInfo user2 = new UserInfo(2L, "user2", "user2@mail.com", "pass2");

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
                UserInfo updatedUser = userService.updateUser(user2, id);
        });
    }

    @Test
    public void testDeleteUser() {
        Long id = 1L;

        userRepository.deleteById(id);
        verify(userRepository).deleteById(id);
    }

}
