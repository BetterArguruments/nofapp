package com.betterarguruments.nofapp;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.util.Log;
import android.widget.RemoteViews;
import android.widget.Toast;

public class CounterWidgetProvider extends AppWidgetProvider
{
    static long updateInterval = 1000 * 60 * 60 * 24;

    // Gets called when the FIRST instance of this widget gets initialized
    @Override
    public void onEnabled(Context context) {
        addAlarmManager(context);
    }

    // Gets called when the LAST instance of this widget gets removed
    @Override
    public void onDisabled(Context ctx) {
        removeAlarmManager(ctx);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d("CounterWdgt#onUpdate", "Updating Widget");
        final int N = appWidgetIds.length;

        DbReader dbReader = new DbReader(context);

        if (dbReader.isDbAvailable() && dbReader.events("Fap").getCount() > 0) {
            int fapStreakInDays = NofappUtils.daysSince(dbReader.dateOfLast("Fap"));
            for (int i=0; i<N; i++) {
                String mainText = Long.toString(fapStreakInDays);
                String subText = NofappUtils.pluralize("DAY", "DAYS", fapStreakInDays);
                updateWidget(context, appWidgetManager, appWidgetIds[i], mainText, subText);
            }
        } else {
            // open MainActivity or initial setup / handle database missing error
            for (int i=0; i<N; i++) {
                updateWidget(context, appWidgetManager, appWidgetIds[i], "?", "no data");
            }
            CharSequence noDataAlert = "Please open NofApp.";
            Toast.makeText(context, noDataAlert, Toast.LENGTH_LONG).show();
        }
    }

    public void updateWidget(Context context, AppWidgetManager appWidgetManager, int id, String mainText, String subText) {
        Intent intent = new Intent(context, EnterDataActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_counter);

        views.setOnClickPendingIntent(R.id.widgetCounter, pendingIntent);
        views.setTextViewText(R.id.widgetCounterMain, mainText);
        views.setTextViewText(R.id.widgetCounterSub, subText);

        appWidgetManager.updateAppWidget(id, views);
    }

    private void addAlarmManager(Context ctx) {
        Log.d("CounterWdgt#addAlmMgr", "adding AlarmManager entry");
        Intent updateIntent = new Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(ctx, 0, updateIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        long tomorrowMidnight = NofappUtils.tomorrow().getTimeInMillis();
        AlarmManager almMgr = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        almMgr.setInexactRepeating(AlarmManager.RTC, tomorrowMidnight, updateInterval, pendingIntent);
    }

    private void removeAlarmManager(Context ctx) {
        Log.d("CounterWdgt#rmAlmMgr", "removing AlarmManager entry");
        Intent updateIntent = new Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(ctx, 0, updateIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        AlarmManager almMgr = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        almMgr.cancel(pendingIntent);
    }
}
