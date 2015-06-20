package com.betterarguruments.nofapp;

import android.os.Bundle;

import org.apache.cordova.CordovaActivity;

/**
 * Created by chris on 15/06/21.
 */
public class EnterDataActivity extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        loadUrl(launchUrl + "#/menu/tabs_enterdata/enterdata_mood");
    }
}
