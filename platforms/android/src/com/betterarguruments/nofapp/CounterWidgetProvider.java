package com.betterarguruments.nofapp;

import android.app.PendingIntent;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.widget.RemoteViews;

public class CounterWidgetProvider extends AppWidgetProvider
{
    public void onUpdate(Context ctx, AppWidgetManager appWidgetMgr, int[] appWidgetIds)
    {
        final int N = appWidgetIds.length;
        int resID = ctx.getResources().getIdentifier("widget_counter", "layout", ctx.getPackageName());

        for (int i=0; i<N; i++) {
            int appWidgetId = appWidgetIds[i];

            Intent intent = new Intent(ctx, EnterDataActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(ctx, 0, intent, 0);

            // get the layout id of the widget
            RemoteViews views = new RemoteViews(ctx.getPackageName(), resID);
            views.setOnClickPendingIntent(R.id.widgetCounter, pendingIntent);

            int fapStreakInDays = NofappUtils.daysSince(new DbReader(ctx).dateOfLast(("Fap")));

            views.setTextViewText(R.id.widgetCounterTimespan, Long.toString(fapStreakInDays));
            views.setTextViewText(R.id.widgetCounterUnit, NofappUtils.pluralize("DAY", "DAYS", fapStreakInDays));

            // Update the current app widget
            appWidgetMgr.updateAppWidget(appWidgetId, views);
        }
    }
}
