package com.betterarguruments.nofapp;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.concurrent.TimeUnit;

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

    public static Calendar tomorrow() {
        Calendar tomorrow = new GregorianCalendar();
        tomorrow.set(Calendar.HOUR_OF_DAY, 0);
        tomorrow.set(Calendar.MINUTE, 0);
        tomorrow.set(Calendar.SECOND, 0);
        tomorrow.set(Calendar.MILLISECOND, 0);
        tomorrow.add(Calendar.DAY_OF_MONTH, 1);
        return tomorrow;
    }

    public static int daysBetween(Date date1, Date date2) {
        long timespan = date2.getTime() - date1.getTime();
        return (int) TimeUnit.DAYS.convert(timespan, TimeUnit.MILLISECONDS);
    }

    public static int daysSince(Date date) {
        return daysBetween(date, new Date(System.currentTimeMillis()));
    }

    public static int daysUntil(Date date) {
        return daysBetween(new Date(System.currentTimeMillis()), date);
    }
}
