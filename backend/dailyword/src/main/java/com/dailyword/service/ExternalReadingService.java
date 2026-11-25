
package com.dailyword.service;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.Duration;

@Service
public class ExternalReadingService {

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    public String getReadingsByDate(LocalDate date) throws Exception {

        String year = String.valueOf(date.getYear());

        String monthDay = date.format(
                DateTimeFormatter.ofPattern("MM-dd")
        );

        String url = "https://cpbjr.github.io/catholic-readings-api/readings/"
                + year + "/" + monthDay + ".json";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(20))
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );

        if (response.statusCode() != 200) {
            throw new RuntimeException(
                    "External API returned status: "
                            + response.statusCode()
            );
        }

        return response.body();
    }
}
