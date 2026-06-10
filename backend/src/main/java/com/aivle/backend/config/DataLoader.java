package com.aivle.backend.config;

import com.aivle.backend.entity.Book;
import com.aivle.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final BookRepository bookRepository;

    @Override
    public void run(String... args) throws Exception {

        if (bookRepository.count() > 0) {
            System.out.println("이미 책 데이터가 존재합니다.");
            return;
        }

        ObjectMapper objectMapper = new ObjectMapper();

        InputStream inputStream = new ClassPathResource("db.json").getInputStream();
        JsonNode root = objectMapper.readTree(inputStream);

        JsonNode books = root.get("books");

        if (books == null || !books.isArray()) {
            System.out.println("db.json에 books 데이터가 없습니다.");
            return;
        }

        for (JsonNode node : books) {
            Book book = new Book();

            book.setTitle(node.get("title").asText());
            book.setAuthor(node.get("author").asText());

            if (node.has("likes")) {
                book.setLikes(node.get("likes").asInt());
            }

            if (node.has("content")) {
                book.setContent(node.get("content").asText());
            }

            if (node.has("coverImageUrl")) {
                book.setCoverImageUrl(node.get("coverImageUrl").asText());
            }

            if (node.has("createdAt")) {
                book.setCreatedAt(parseDateTime(node.get("createdAt").asText()));
            }

            if (node.has("updatedAt")) {
                book.setUpdatedAt(parseDateTime(node.get("updatedAt").asText()));
            }

            if (node.has("tags") && node.get("tags").isArray()) {
                for (JsonNode tagNode : node.get("tags")) {
                    book.getTags().add(tagNode.asText());
                }
            }

            bookRepository.save(book);
        }

        System.out.println("db.json 책 데이터 H2 DB 저장 완료");
    }

    private LocalDateTime parseDateTime(String value) {
        try {
            return LocalDateTime.parse(value);
        } catch (Exception e) {
            return LocalDateTime.now();
        }
    }
}