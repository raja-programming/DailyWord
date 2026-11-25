
package com.dailyword.controller;

import com.dailyword.entity.Reading;
import com.dailyword.service.ReadingService;
import com.dailyword.service.ExternalReadingService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;

@RestController
@RequestMapping("/api/readings")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173"
})
public class ReadingController {

    private final ReadingService readingService;
    private final ExternalReadingService externalReadingService;

    public ReadingController(
            ReadingService readingService,
            ExternalReadingService externalReadingService) {

        this.readingService = readingService;
        this.externalReadingService = externalReadingService;
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodayReadings() {

        return readingService.getTodayReading()
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(
                        Map.of(
                                "status", "SUCCESS",
                                "message", "No readings available for today",
                                "date", LocalDate.now().toString()
                        )
                ));
    }

    @GetMapping("/{date}")
    public ResponseEntity<?> getReadingByDate(
            @PathVariable String date) {

        try {
            LocalDate selectedDate = LocalDate.parse(date);

            return readingService.getReadingByDate(selectedDate)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(404).body(
                            Map.of(
                                    "status", "NOT_FOUND",
                                    "message", "No readings available for this date",
                                    "date", date
                            )
                    ));

        } catch (DateTimeParseException exception) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Invalid date format. Use YYYY-MM-DD"
                    )
            );
        }
    }

    @GetMapping("/external/{date}")
    public ResponseEntity<?> getExternalReadings(
            @PathVariable String date) {

        try {
            LocalDate selectedDate = LocalDate.parse(date);

            String readings =
                    externalReadingService.getReadingsByDate(selectedDate);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(readings);

        } catch (DateTimeParseException exception) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Invalid date format. Use YYYY-MM-DD"
                    )
            );

        } catch (Exception exception) {

            exception.printStackTrace();

            return ResponseEntity.status(502).body(
                    Map.of(
                            "message",
                            "External API Error: " + exception.getMessage()
                    )
            );
        }
    }

    @PostMapping
    public ResponseEntity<Reading> saveReading(
            @RequestBody Reading reading) {

        Reading savedReading = readingService.saveReading(reading);

        return ResponseEntity.ok(savedReading);
    }
}
