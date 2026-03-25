package com.freshfits.ecommerce.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.freshfits.ecommerce.service.orders.payments.PaymentService;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.math.BigDecimal;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;

import java.util.Base64;

@RestController
@RequestMapping("/api/webhook")
public class YocoWebhookController {

    @Value("${yoco.webhook.secret}")
    private String yocoSecret; // Expected format: "whsec_XXXXXXXXXXXXXXXXXXXXXXXXX="

    private static final long TIMESTAMP_THRESHOLD_SECONDS = 180; // 3 minutes

    
    private final PaymentService paymentService; 

    public YocoWebhookController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/yoco")
    public ResponseEntity<String> handleYocoWebhook(
            @RequestHeader(value = "webhook-id", required = false) String webhookId,
            @RequestHeader(value = "webhook-timestamp", required = false) String webhookTimestamp,
            @RequestHeader(value = "webhook-signature", required = false) String signature,
            @RequestBody byte[] payloadBytes) {

        String payload = new String(payloadBytes, StandardCharsets.UTF_8);
        System.out.println("Received payload: " + payload);
        System.out.println("Webhook ID: " + webhookId);
        System.out.println("Webhook Timestamp: " + webhookTimestamp);
        System.out.println("Webhook Signature: " + signature);

        if (webhookId == null || webhookTimestamp == null || signature == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing required headers");
        }

        // Check timestamp to prevent replay attacks
        long eventTimestamp;
        try {
            eventTimestamp = Long.parseLong(webhookTimestamp);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid timestamp");
        }

        long nowEpoch = Instant.now().getEpochSecond();
        if (Math.abs(nowEpoch - eventTimestamp) > TIMESTAMP_THRESHOLD_SECONDS) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Timestamp outside allowable threshold");
        }

        // Construct signed content: webhook-id + "." + webhook-timestamp + "." + payload
        String signedContent = webhookId + "." + webhookTimestamp + "." + payload;

        try {
            if (verifySignature(signedContent, signature)) {
                
                
                
     JSONObject jsonPayload = new JSONObject(payload);
            String eventType = jsonPayload.optString("type"); // top-level "type"
            JSONObject data = jsonPayload.optJSONObject("payload"); // actual payload

            if (data != null) {
               
               
               BigDecimal amount = data.optBigDecimal("amount", null);
               


                JSONObject metadata = data.optJSONObject("metadata");
                String reason = metadata.optString("reason", null);
                Long orderId = null;
                if (metadata != null) {
                    String orderIdStr = metadata.optString("order_id", null); // default null if not present
                    if (orderIdStr != null && !orderIdStr.isEmpty()) {
                        try {
                            orderId = Long.parseLong(orderIdStr);
                        } catch (NumberFormatException e) {
                            System.out.println("Invalid order_id format in metadata");
                        }
                    }
                }
                

                switch (eventType) {
                    case "payment.succeeded":
                      
                        paymentService.handlePaymentWebhookSuccess(orderId,amount);

                        break;

                    case "payment.failed":
                       
                        paymentService.handlePaymentFailure(orderId, amount);
                        
                        break;

                    case "refund.succeeded":
                        paymentService.handleRefundSucceeded(orderId,reason);
                          break;

                case "refund.failed":
                    paymentService.handleRefundFailed(orderId,reason);
                    System.out.println("Refund failed for checkout " + data.optString("checkoutId"));
                    break;

                    default:
                       
                        return ResponseEntity.ok("Event ignored");
                }

                return ResponseEntity.ok("Webhook processed for checkout " + orderId);
            } else {
                
                return ResponseEntity.badRequest().body("Invalid payload");
            }

                
            } else {
                
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying signature");
        }
    }

    

    private boolean verifySignature(String signedContent, String signatureHeader) throws Exception {
        // Extract first signature and remove version prefix "v1,"
        String firstSignature = signatureHeader.split(" ")[0];
        if (firstSignature.contains(",")) {
            firstSignature = firstSignature.split(",")[1].trim();
        }

        // Remove "whsec_" prefix and base64 decode
        if (!yocoSecret.startsWith("whsec_")) {
            throw new IllegalArgumentException("Secret key must start with 'whsec_'");
        }
        String base64Secret = yocoSecret.substring(6);
        byte[] secretBytes = Base64.getDecoder().decode(base64Secret);

        // Compute HMAC-SHA256
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secretBytes, "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] computedHmac = sha256Hmac.doFinal(signedContent.getBytes(StandardCharsets.UTF_8));

        String expectedSignature = Base64.getEncoder().encodeToString(computedHmac);

        // Constant-time comparison
        return MessageDigest.isEqual(
                expectedSignature.getBytes(StandardCharsets.UTF_8),
                firstSignature.getBytes(StandardCharsets.UTF_8)
        );
    }
}
