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
        Comment comment = new Comment(1L, null, null, "Great trip!");

        when(commentRepository.save(Mockito.any(Comment.class))).thenReturn(comment);

        Comment savedComment = commentService.createComment(comment);

        Assertions.assertNotNull(savedComment);
    }

    @Test
    public void testGetAllComments() {
        Comment comment1 = new Comment(1L, null, null, "Great trip!");
        Comment comment2 = new Comment(2L, null, null, "Amazing experience!");

        List<Comment> allComments = List.of(comment1, comment2);

        when(commentRepository.findAll()).thenReturn(allComments);

        List<Comment> comments = commentService.getAllComments();

        Assertions.assertNotNull(comments);
        Assertions.assertEquals(2, comments.size());
    }

    @Test
    public void testCommentByIdExists() {
        Long id = 1L;
        Comment comment = new Comment(id, null, null, "Great trip!");
        when(commentRepository.findById(id)).thenReturn(Optional.of(comment));

        Optional<Comment> commentReturn = commentService.getCommentById(id);

        Assertions.assertTrue(commentReturn.isPresent());
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
        Comment existingComment = new Comment(id, null, null, "Great trip!");
        Comment updatedComment = new Comment(id, null, null, "Amazing experience!");

        when(commentRepository.findById(id)).thenReturn(Optional.of(existingComment));
        when(commentRepository.save(updatedComment)).thenReturn(updatedComment);

        Comment updatedCommentReturn = commentService.updateComment(updatedComment, id);

        Assertions.assertNotNull(updatedCommentReturn);
        Assertions.assertEquals(updatedComment.getContent(), updatedCommentReturn.getContent());
    }

    @Test
    public void testUpdateCommentIfDoesntExist() {
        Long id = 3L;
        Comment updatedComment = new Comment(2L, null, null, "Amazing experience!");

        when(commentRepository.findById(id)).thenReturn(Optional.empty());

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            commentService.updateComment(updatedComment, id);
        });
    }

    @Test
    public void testDeleteComment() {
        Long id = 1L;

        commentService.deleteComment(id);

        verify(commentRepository).deleteById(id);
    }
}
