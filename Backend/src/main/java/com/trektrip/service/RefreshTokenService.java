package com.trektrip.service;

import com.trektrip.model.RefreshToken;
import com.trektrip.model.UserInfo;
import com.trektrip.repository.RefreshTokenRepository;
import com.trektrip.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.sql.Ref;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RefreshTokenService {

    private RefreshTokenRepository refreshTokenRepository;

    private UserRepository userRepository;

    public RefreshToken createRefreshToken(String username){
        Optional<UserInfo> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            RefreshToken refreshToken = RefreshToken.builder()
                    .userInfo(userOptional.get())
                    .token(UUID.randomUUID().toString())
                    .expiryDate(Instant.now().plusMillis(10000))
                    .build();
            return refreshTokenRepository.save(refreshToken);
        } else {
            throw new UsernameNotFoundException(username);
        }
    }

    public Optional<RefreshToken> findByToken(String token){
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token){
        if(token.getExpiryDate().compareTo(Instant.now())<0){
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token is expired. Please make a new login..!");
        }
        return token;
    }

    public void deleteByUserId(Long userId) {
        Iterable<RefreshToken> allRefreshTokens = refreshTokenRepository.findAll();

        for (RefreshToken rt : allRefreshTokens) {
            if (rt.getUserInfo().getId().equals(userId))
                refreshTokenRepository.delete(rt);
        }

    }

}
