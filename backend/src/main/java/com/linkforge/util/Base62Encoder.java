package com.linkforge.util;

import java.security.SecureRandom;

/**
 * System Design Note: Base62 Encoding for URL Shortening.
 * The alphabet consists of 62 alphanumeric characters: 0-9, a-z, A-Z.
 * It is completely URL-safe (no special characters like ?, &, /, +, =).
 * - A 6-character Base62 slug provides 62^6 = ~56.8 Billion unique URLs.
 * - A 7-character Base62 slug provides 62^7 = ~3.5 Trillion unique URLs.
 */
public final class Base62Encoder {

    private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = ALPHABET.length();
    private static final SecureRandom RANDOM = new SecureRandom();

    private Base62Encoder() {
    }

    /**
     * Converts a positive integer / long to its Base62 string representation.
     */
    public static String fromBase10(long number) {
        if (number <= 0) {
            return "0";
        }
        StringBuilder sb = new StringBuilder();
        while (number > 0) {
            int remainder = (int) (number % BASE);
            sb.append(ALPHABET.charAt(remainder));
            number /= BASE;
        }
        return sb.reverse().toString();
    }

    /**
     * Generates a collision-resistant random Base62 slug of specified length.
     */
    public static String generateRandomSlug(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = RANDOM.nextInt(BASE);
            sb.append(ALPHABET.charAt(index));
        }
        return sb.toString();
    }
}
