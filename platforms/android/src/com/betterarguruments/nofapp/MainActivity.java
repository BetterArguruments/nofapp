/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.betterarguruments.nofapp;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.*;

public class MainActivity extends CordovaActivity
{
    public static final String ACTION_USER_UPDATE = "com.betterarguruments.nofapp.APPWIDGET_UPDATE_USER";
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }

    public void onPause() {
        super.onPause();
        Log.d("MainActivity#onPause", "Calling refresh intent");
        Context ctx = getApplicationContext();
        Intent updateIntent = new Intent(ctx, CounterWidgetProvider.class);
        updateIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        AppWidgetManager widgetMgr = AppWidgetManager.getInstance(ctx);
        int[] widgetIds = widgetMgr.getAppWidgetIds(new ComponentName(ctx, CounterWidgetProvider.class));
        Log.d("MainActivity#onPause", "Widget count: " + widgetIds.length);
        updateIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, widgetIds);
        sendBroadcast(updateIntent);
    }
}
