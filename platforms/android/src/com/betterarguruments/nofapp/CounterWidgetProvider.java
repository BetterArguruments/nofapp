package com.betterarguruments.nofapp;

import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.appwidget.AppWidgetManager;
import android.widget.RemoteViews;

import java.util.Date;
import java.util.concurrent.TimeUnit;

public class CounterWidgetProvider extends AppWidgetProvider
{
    public void onUpdate(Context ctx, AppWidgetManager appWidgetMgr, int[] appWidgetIds)
    {
        final int N = appWidgetIds.length;
        int resID = ctx.getResources().getIdentifier("widget_counter", "layout", ctx.getPackageName());

        for (int i=0; i<N; i++) {
            int appWidgetId = appWidgetIds[i];

            //Intent intent = new Intent(ctx, UpdateWidgetActivity.class);
            //PendingIntent pendingIntent = PendingIntent.getActivity(ctx, 0, intent, 0);

            // get the layout id of the widget
            RemoteViews views = new RemoteViews(ctx.getPackageName(), resID);
            // Set date relations
            Date lastFapDate = new DbReader(ctx).dateOfLast("Fap");
            Date today = new Date(System.currentTimeMillis());

            long timespan = today.getTime() - lastFapDate.getTime();
            int fapStreakInDays = (int) TimeUnit.DAYS.convert(timespan, TimeUnit.MILLISECONDS);

            views.setTextViewText(R.id.widgetCounterTimespan, Long.toString(fapStreakInDays));
            views.setTextViewText(R.id.widgetCounterUnit, NofappUtils.pluralize("DAY", "DAYS", fapStreakInDays));

            // Update the current app widget
            appWidgetMgr.updateAppWidget(appWidgetId, views);
        }
    }
}
