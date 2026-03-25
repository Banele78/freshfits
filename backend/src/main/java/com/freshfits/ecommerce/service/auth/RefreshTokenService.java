package com.freshfits.ecommerce.service.auth;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.freshfits.ecommerce.dto.auth.RefreshTokenWithUserDTO;
import com.freshfits.ecommerce.entity.RefreshToken;
import com.freshfits.ecommerce.entity.User;
import com.freshfits.ecommerce.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);

    

    @Value("${jwt.refreshExpirationMs:604800000}")
    private Long refreshExpirationMs;

    private final RefreshTokenRepository refreshTokenRepo;
    private final RefreshTokenTransactionalService refreshTokenTransactionalService;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepo,
                               RefreshTokenTransactionalService refreshTokenTransactionalService) {
        this.refreshTokenRepo = refreshTokenRepo;
        this.refreshTokenTransactionalService = refreshTokenTransactionalService;
    }

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setExpiryDate(Instant.now().plusMillis(refreshExpirationMs));
        token.setToken(UUID.randomUUID().toString());

        RefreshToken saved = refreshTokenRepo.save(token);
        log.info("Created refresh token for user={}", user.getId());
        return saved;
    }

@Transactional
public Optional<RefreshToken> consumeAndVerifyToken(String token) {
    Optional<RefreshTokenWithUserDTO> dtoOpt = refreshTokenRepo.findValidTokenWithUser(token, Instant.now());

    if (dtoOpt.isEmpty()) return Optional.empty();

    // Delete token
    refreshTokenRepo.deleteValidToken(token, Instant.now());

    // Map to transient RefreshToken entity
    RefreshToken tokenEntity = new RefreshToken();
    tokenEntity.setId(dtoOpt.get().tokenId());
    tokenEntity.setToken(dtoOpt.get().token());
    tokenEntity.setExpiryDate(dtoOpt.get().expiryDate());

    User user = new User();
    user.setId(dtoOpt.get().userId());
    user.setName(dtoOpt.get().userName());
    user.setEmail(dtoOpt.get().userEmail());

    tokenEntity.setUser(user);

    return Optional.of(tokenEntity);
}






    @Transactional(readOnly = true)
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepo.findByToken(token);
    }

    @Transactional
    public void delete(RefreshToken token) {
        refreshTokenRepo.delete(token);
        log.info("Deleted refresh token for user={}", token.getUser().getId());
    }

    @Transactional
    public void deleteByUser(User user) {
        int deleted = refreshTokenRepo.deleteByUser(user);
        log.info("Deleted {} refresh tokens for user={}", deleted, user.getId());
    }


    @Scheduled(cron = "0 0 2 * * ?")
    public void purgeExpiredNightly() {
        try {
            int purged = refreshTokenTransactionalService.purgeExpired();
            log.info("Nightly purge completed: {} expired tokens removed", purged);
        } catch (Exception e) {
            log.error("Nightly purge failed", e);
        }
    }
}