package com.freshfits.ecommerce.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class NgrokService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String getNgrokUrl() {
        try {
            String url = "http://127.0.0.1:4040/api/tunnels";
            String response = restTemplate.getForObject(url, String.class);

            JSONObject json = new JSONObject(response);
            JSONArray tunnels = json.getJSONArray("tunnels");

            for (int i = 0; i < tunnels.length(); i++) {
                JSONObject tunnel = tunnels.getJSONObject(i);

                // look for the https tunnel
                if ("https".equalsIgnoreCase(tunnel.optString("proto"))) {
                    return tunnel.getString("public_url");
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️ Could not fetch ngrok URL. Is ngrok running?");
            e.printStackTrace();
        }
        return null;
    }
}
