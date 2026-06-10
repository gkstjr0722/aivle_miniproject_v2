package com.aivle.backend.controller;

import com.aivle.backend.entity.Review;
import com.aivle.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;

    // 전체 리뷰 조회 또는 특정 책 리뷰 조회
    @GetMapping
    public List<Review> getReviews(@RequestParam(required = false) Long bookId) {
        if (bookId != null) {
            return reviewRepository.findByBookId(bookId);
        }
        return reviewRepository.findAll();
    }

    // 리뷰 등록
    @PostMapping
    public Review createReview(@RequestBody Review review) {
        return reviewRepository.save(review);
    }

    // 리뷰 수정
    @PatchMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found: " + id));

        if (request.getContent() != null) {
            review.setContent(request.getContent());
        }

        if (request.getNickname() != null) {
            review.setNickname(request.getNickname());
        }

        review.setLikes(request.getLikes());

        return reviewRepository.save(review);
    }

    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
    }
}