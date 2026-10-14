package com.linkforge.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class Base62EncoderTest {

    @Test
    void testFromBase10() {
        assertEquals("0", Base62Encoder.fromBase10(0));
        assertEquals("1", Base62Encoder.fromBase10(1));
        assertEquals("z", Base62Encoder.fromBase10(35));
        assertEquals("Z", Base62Encoder.fromBase10(61));
        assertEquals("10", Base62Encoder.fromBase10(62));
    }

    @Test
    void testGenerateRandomSlug() {
        String slug = Base62Encoder.generateRandomSlug(7);
        assertNotNull(slug);
        assertEquals(7, slug.length());
        assertTrue(slug.matches("^[0-9a-zA-Z]{7}$"));
    }
}
