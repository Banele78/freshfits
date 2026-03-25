package com.freshfits.ecommerce.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public final class SlugUtil {

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
    private static final Pattern MULTIPLE_DASHES = Pattern.compile("-{2,}");

    private SlugUtil() {
        // utility class
    }

    public static String toSlug(String input) {

        if (input == null || input.isBlank()) {
            return "item";
        }

        // Normalize accented characters (é → e, ü → u)
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        String slug = normalized
                .toLowerCase(Locale.ENGLISH)
                .trim();

        // Replace whitespace with dash
        slug = WHITESPACE.matcher(slug).replaceAll("-");

        // Remove non-latin characters
        slug = NONLATIN.matcher(slug).replaceAll("");

        // Collapse multiple dashes
        slug = MULTIPLE_DASHES.matcher(slug).replaceAll("-");

        // Trim leading/trailing dashes
        slug = slug.replaceAll("^-|-$", "");

        return slug.isBlank() ? "item" : slug;
    }
}
