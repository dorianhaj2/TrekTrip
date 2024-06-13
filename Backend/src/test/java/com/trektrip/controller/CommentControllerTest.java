package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.dto.CommentRequestDTO;
import com.trektrip.model.Comment;
import com.trektrip.model.Trip;
import com.trektrip.model.UserInfo;
import com.trektrip.service.CommentService;
import com.trektrip.service.JwtService;
import com.trektrip.service.UserDetailsServiceImpl;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;

@WebMvcTest(CommentController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentService commentService;

    @MockBean
    private JwtService jwtService;
    
    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private Comment comment1;
    private Comment comment2;

    @BeforeEach
    public void setUp() {
        UserInfo user = new UserInfo(1L, "username", "email@example.com", "password");
        Trip trip = new Trip(1L, "Trip Title", "Trip Description", 7, true);

        comment1 = new Comment(1L, user, trip, "Great trip!");
        comment2 = new Comment(2L, user, trip, "Amazing experience!");
    }

    @Test
    @WithMockUser
    public void testGetAllComments() throws Exception {
        List<Comment> comments = new ArrayList<>();
        comments.add(comment1);
        comments.add(comment2);

        when(commentService.getAllComments()).thenReturn(comments);

        mockMvc.perform(MockMvcRequestBuilders.get("/comment/all"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()", CoreMatchers.is(comments.size())));
    }

    @Test
    @WithMockUser
    public void testGetCommentById() throws Exception {
        Long commentId = 1L;

        when(commentService.getCommentById(commentId)).thenReturn(Optional.of(comment1));

        mockMvc.perform(MockMvcRequestBuilders.get("/comment/{id}", commentId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(commentId));
    }

    @Test
    @WithMockUser
    public void testCreateComment() throws Exception {
        CommentRequestDTO requestDTO = new CommentRequestDTO(1L, 1L, "Great trip!");

        when(commentService.createComment(any(Comment.class))).thenReturn(comment1);

        mockMvc.perform(MockMvcRequestBuilders.post("/comment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value(requestDTO.getContent()));
    }

    @Test
    @WithMockUser
    public void testUpdateComment() throws Exception {
        Long commentId = 1L;

        when(commentService.updateComment(any(Comment.class), any(Long.class))).thenReturn(comment1);

        mockMvc.perform(MockMvcRequestBuilders.put("/comment/{id}", commentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(comment1)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(commentId));
    }

    @Test
    @WithMockUser
    public void testDeleteComment() throws Exception {
        Long commentId = 1L;

        mockMvc.perform(MockMvcRequestBuilders.delete("/comment/{id}", commentId))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
