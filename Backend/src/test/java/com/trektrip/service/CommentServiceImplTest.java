package com.trektrip.service;

import com.trektrip.model.Comment;
import com.trektrip.repository.CommentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceImplTest {
    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentServiceImpl commentService;

    @Test
    public void testCreateComment() {
        Comment comment = new Comment(1L, null, null, "Great trip!", LocalDateTime.now());

        when(commentRepository.save(Mockito.any(Comment.class))).thenReturn(comment);

        Comment savedComment = commentService.createComment(comment);

        Assertions.assertNotNull(savedComment);
    }

    @Test
    public void testGetAllComments() {
        Comment comment1 = new Comment(1L, null, null, "Great trip!", LocalDateTime.now());
        Comment comment2 = new Comment(2L, null, null, "Amazing experience!", LocalDateTime.now());

        List<Comment> allComments = List.of(comment1, comment2);

        when(commentRepository.findAll()).thenReturn(allComments);

        Assertions.assertNotNull(commentService.getAllComments());
        Assertions.assertEquals(2, commentService.getAllComments().size());
    }

    @Test
    public void testCommentByIdExists() {
        Long id = 1L;
        Comment comment = new Comment(1L, null, null, "Great trip!", LocalDateTime.now());
        when(commentRepository.findById(id)).thenReturn(Optional.of(comment));

        Optional<Comment> commentReturn = commentService.getCommentById(id);

        Assertions.assertNotNull(commentReturn.get());
    }

    @Test
    public void testCommentByIdDoesntExist() {
        Long id = 2L;
        when(commentRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Comment> commentReturn = commentService.getCommentById(id);

        Assertions.assertTrue(commentReturn.isEmpty());
    }

    @Test
    public void testUpdateComment() {
        Long id = 1L;
        Comment comment1 = new Comment(1L, null, null, "Great trip!", LocalDateTime.now());
        Comment comment2 = new Comment(2L, null, null, "Amazing experience!", LocalDateTime.now());

        when(commentRepository.findById(id)).thenReturn(Optional.of(comment1));
        when(commentRepository.save(comment2)).thenReturn(comment2);

        Comment updateReturn = commentService.updateComment(comment2, id);

        Assertions.assertNotNull(updateReturn);
    }

    @Test
    public void testUpdateCommentIfDoesntExist() {
        Long id = 3L;
        Comment comment2 = new Comment(2L, null, null, "Amazing experience!", LocalDateTime.now());

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            Comment updatedComment = commentService.updateComment(comment2, id);
        });
    }

    @Test
    public void testDeleteComment() {
        Long id = 1L;

        commentRepository.deleteById(id);
        verify(commentRepository).deleteById(id);
    }
}
