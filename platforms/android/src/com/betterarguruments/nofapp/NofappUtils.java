package com.betterarguruments.nofapp;

/**
 * Created by chris on 15/06/20.
 */
public class NofappUtils {
    public static String pluralize(String singular, String plural, int count, Boolean zeroIsPlural) {
        switch (count) {
            case 0:
                if (zeroIsPlural) {
                    return plural;
                }
                return singular;
            case 1:
            case -1:
                return singular;
            default:
                return plural;
        }
    }

    public static String pluralize(String singular, String plural, int count) {
        return pluralize(singular, plural, count, true);
    }
}
