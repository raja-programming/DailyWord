
package com.dailyword.service;

import com.dailyword.entity.Reading;
import com.dailyword.repository.ReadingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class ReadingService {

    private final ReadingRepository readingRepository;

    public ReadingService(ReadingRepository readingRepository) {
        this.readingRepository = readingRepository;
    }

    // Get today's reading
    public Optional<Reading> getTodayReading() {
        return readingRepository.findByReadingDate(LocalDate.now());
    }

    // Get reading by selected date
    public Optional<Reading> getReadingByDate(LocalDate date) {
        return readingRepository.findByReadingDate(date);
    }

    // Save reading
    public Reading saveReading(Reading reading) {
        return readingRepository.save(reading);
    }
}
