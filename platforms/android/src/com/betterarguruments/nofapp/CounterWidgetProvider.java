package com.betterarguruments.nofapp;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.util.Log;
import android.widget.RemoteViews;

public class CounterWidgetProvider extends AppWidgetProvider
{
    static long updateInterval = 1000 * 60 * 60 * 24;

    // Gets called when the FIRST instance of this widget gets initialized
    @Override
    public void onEnabled(Context ctx) {
        Log.d("CounterWdgt#onEnabled", "adding AlarmManager entry");
        Intent updateIntent = new Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(ctx, 0, updateIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        long tomorrowMidnight = NofappUtils.tomorrow().getTimeInMillis();
        AlarmManager almMgr = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        almMgr.setInexactRepeating(AlarmManager.RTC, tomorrowMidnight, updateInterval, pendingIntent);
    }

    // Gets called when the LAST instance of this widget gets removed
    @Override
    public void onDisabled(Context ctx) {
        Log.d("CounterWdgt#onDisabled", "removing AlarmManager entry");
        Intent updateIntent = new Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(ctx, 0, updateIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        AlarmManager almMgr = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        almMgr.cancel(pendingIntent);
    }

    @Override
    public void onUpdate(Context ctx, AppWidgetManager appWidgetMgr, int[] appWidgetIds) {
        Log.d("CounterWdgt#onUpdate", "Updating Widget");
        final int N = appWidgetIds.length;
        int resID = R.layout.widget_counter;

        DbReader dbReader = new DbReader(ctx);

        if (dbReader.isDbAvailable()) {
            // get metrics and update widgets accordingly
            int fapStreakInDays = NofappUtils.daysSince(dbReader.dateOfLast("Fap"));
            for (int i=0; i<N; i++) {
                int appWidgetId = appWidgetIds[i];

                Intent intent = new Intent(ctx, EnterDataActivity.class);
                PendingIntent pendingIntent = PendingIntent.getActivity(ctx, 0, intent, 0);

                // get the layout id of the widget
                RemoteViews views = new RemoteViews(ctx.getPackageName(), resID);
                views.setOnClickPendingIntent(R.id.widgetCounter, pendingIntent);

                views.setTextViewText(R.id.widgetCounterTimespan, Long.toString(fapStreakInDays));
                views.setTextViewText(R.id.widgetCounterUnit, NofappUtils.pluralize("DAY", "DAYS", fapStreakInDays));

                // Update the current app widget
                appWidgetMgr.updateAppWidget(appWidgetId, views);
            }
        } else {
            // open MainActivity or initial setup / handle database missing error
        }
    }
}
