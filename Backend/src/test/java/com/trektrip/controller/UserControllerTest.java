package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.controller.UserController;
import com.trektrip.model.Trip;
import com.trektrip.model.UserInfo;
import com.trektrip.model.UserRole;
import com.trektrip.service.UserService;
import com.trektrip.service.UserDetailsServiceImpl;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserInfo user1;
    private UserInfo user2;

    @BeforeEach
    public void init() {
        // Create user1 with minimum required fields
        user1 = new UserInfo();
        user1.setId(1L);
        user1.setUsername("user1");
        user1.setEmail("user1@mail.com");
        user1.setPassword("pass1");

        // Create user2 with additional fields populated
        user2 = new UserInfo();
        user2.setId(2L);
        user2.setUsername("user2");
        user2.setEmail("user2@mail.com");
        user2.setPassword("pass2");
        user2.setImage(null); // Provide appropriate Image instance if needed
        user2.setDescription("Description for user2");
        user2.setRoles(List.of(new UserRole(/* Populate UserRole fields */)));
        user2.setTrips(List.of(new Trip(/* Populate Trip fields */)));
    }

    @Test
    public void testCreateUser() throws Exception {
        given(userService.createUser(ArgumentMatchers.any())).willAnswer((invocationOnMock -> invocationOnMock.getArgument(0)));

        ResultActions response = mockMvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user1)));

        response.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(user1.getUsername())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(user1.getEmail())));
    }

    @Test
    public void testGetAllUsers() throws Exception {
        List<UserInfo> allUsers = List.of(user1, user2);
        when(userService.getAllUsers()).thenReturn(allUsers);

        ResultActions response = mockMvc.perform(get("/user/all")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()", CoreMatchers.is(allUsers.size())));

    }

    @Test
    @WithMockUser
    public void testGetUserByIdExists() throws Exception {
        Long id = 1L;
        when(userService.getUserById(id)).thenReturn(Optional.of(user1));

        ResultActions response = mockMvc.perform(get("/user/{id}", id)
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(user1.getUsername())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(user1.getEmail())));
    }

    @Test
    @WithMockUser
    public void testGetUserByIdDoesntExist() throws Exception {
        Long id = 3L;
        when(userService.getUserById(id)).thenReturn(Optional.empty());

        ResultActions response = mockMvc.perform(get("/user/{id}", id)
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @WithMockUser
    public void testUpdateUser() throws Exception {
        Long id = 1L;
        when(userService.updateUser(any(UserInfo.class), any(Long.class))).thenReturn(user2);

        ResultActions response = mockMvc.perform(put("/user/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user2)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(user2.getUsername())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(user2.getEmail())));
    }

    @Test
    @WithMockUser
    public void testDeleteUser() throws Exception {
        Long id = 1L;
        doNothing().when(userService).deleteUser(id);

        ResultActions response = mockMvc.perform(delete("/user/{id}", id)
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
