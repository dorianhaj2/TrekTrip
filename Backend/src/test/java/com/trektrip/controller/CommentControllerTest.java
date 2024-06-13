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
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = CommentController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class CommentControllerTest {
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
    public void init() {
        UserInfo user = new UserInfo();
        user.setId(1L);
        
        Trip trip = new Trip();
        trip.setId(1L);

        comment1 = new Comment(1L, user, trip, "Great trip!", LocalDateTime.now());
        comment2 = new Comment(2L, user, trip, "Amazing experience!", LocalDateTime.now());
    }

    @Test
    @WithMockUser
    public void testCreateComment() throws Exception {
        CommentRequestDTO commentRequest = new CommentRequestDTO(1L, 1L, "Great trip!");
        given(commentService.createComment(ArgumentMatchers.any())).willAnswer((invocationOnMock -> invocationOnMock.getArgument(0)));

        ResultActions response = mockMvc.perform(post("/comment")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentRequest)));

        response.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content", CoreMatchers.is(comment1.getContent())));
    }

    @Test
    @WithMockUser
    public void testGetAllComments() throws Exception {
        List<Comment> allComments = List.of(comment1, comment2);
        when(commentService.getAllComments()).thenReturn(allComments);

        ResultActions response = mockMvc.perform(get("/comment/all")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()", CoreMatchers.is(allComments.size())));
    }

    @Test
    @WithMockUser
    public void testGetCommentByIdIfExists() throws Exception {
        Long id = 1L;
        when(commentService.getCommentById(id)).thenReturn(Optional.of(comment1));

        ResultActions response = mockMvc.perform(get("/comment/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(comment1)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content", CoreMatchers.is(comment1.getContent())));
    }

    @Test
    @WithMockUser
    public void testGetCommentByIdDoesntExist() throws Exception {
        Long id = 3L;
        when(commentService.getCommentById(id)).thenReturn(Optional.empty());

        ResultActions response = mockMvc.perform(get("/comment/3")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @WithMockUser
    public void testUpdateComment() throws Exception {
        Long id = 1L;
        when(commentService.updateComment(comment2, id)).thenReturn(comment2);

        ResultActions response = mockMvc.perform(put("/comment/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(comment2)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content", CoreMatchers.is(comment2.getContent())));
    }

    @Test
    @WithMockUser
    public void testDeleteComment() throws Exception {
        Long id = 1L;
        doNothing().when(commentService).deleteComment(id);

        ResultActions response = mockMvc.perform(delete("/comment/1")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }

}
