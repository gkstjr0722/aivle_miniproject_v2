package com.aivle.backend.auth;

import com.aivle.backend.exception.UnauthorizedException;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SimpleTokenProvider {

    private final Map<String, Long> tokenStore = new ConcurrentHashMap<>();

    public String createToken(Long userId) {
        String token = UUID.randomUUID().toString();
        tokenStore.put(token, userId);
        return token;
    }

    public Long getUserId(String authorizationHeader) {
        String token = resolveBearerToken(authorizationHeader);

        Long userId = tokenStore.get(token);
        if (userId == null) {
            throw new UnauthorizedException("유효하지 않은 토큰입니다.");
        }

        return userId;
    }

    public Long getUserIdOrNull(String authorizationHeader) {
        try {
            String token = resolveBearerToken(authorizationHeader);
            return tokenStore.get(token);
        } catch (UnauthorizedException e) {
            return null;
        }
    }

    private String resolveBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Authorization 헤더 형식이 올바르지 않습니다.");
        }

        String token = authorizationHeader.substring(7).trim();

        if (token.isBlank()) {
            throw new UnauthorizedException("토큰이 비어 있습니다.");
        }

        return token;
    }
}
