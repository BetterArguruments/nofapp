package com.betterarguruments.nofapp;

import com.betterarguruments.nofapp.R;
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

            Intent intent = new Intent(ctx, UpdateWidgetActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(ctx, 0, intent, 0);

            // get the layout id of the widget
            RemoteViews views = new RemoteViews(ctx.getPackageName(), resID);
            views.setTextViewText(R.id.widgetCounterDays, "Dont fuck with me!");
            //views.setOnClickPendingIntent(R.id., pendingIntent);

            // Update the current app widget
            appWidgetMgr.updateAppWidget(appWidgetId, views);
        }
    }
}