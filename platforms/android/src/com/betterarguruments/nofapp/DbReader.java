package com.betterarguruments.nofapp;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import java.io.File;
import java.util.Arrays;
import java.util.Date;

/**
 * Warning: this class is far from complete.
 * TODO #1: add exception handling for not existing database file, e.g. prior to first launch.
 */
public class DbReader {
    // refactor into config file
    private final String DB_FILE = "nofapp.db";
    protected SQLiteDatabase db;
    protected int SQLITE_ACCESS = SQLiteDatabase.OPEN_READONLY;
    private Context context;
    private File dbPath;
    private final String QUERY_JOIN_EVENTS = "FROM events JOIN event_types ON (event_types.id = events.type)";
    private final String QUERY_WHERE_EVENT_NAME = "WHERE event_types.name = ?";

    public DbReader(Context ctx) {
        this.context = ctx;
        this.dbPath = context.getDatabasePath(DB_FILE);
        Log.d("NoFapp::DbReader", "DB at: " + this.dbPath.getPath().toString());
        this.db = SQLiteDatabase.openDatabase(this.dbPath.getPath(), null, SQLITE_ACCESS);
    }

    public Date dateOfLast(String event, String time_col) {
        // build the query from templates
        String query_time_last = "SELECT " + time_col + " " + QUERY_JOIN_EVENTS + " " + QUERY_WHERE_EVENT_NAME +
                " ORDER BY events.time DESC LIMIT 1";
        // Query time column
        Cursor cursor = db.rawQuery(query_time_last, new String[] {event});
        // move cursor to first returned column
        cursor.moveToFirst();
        long time = cursor.getLong(cursor.getColumnIndex(time_col)) * 1000;
        Log.d("NoFapp::DbReader", "#dateOfLast(" + event + ", " + time_col + ") returned (" + time + ")");
        return new Date(time);
    }

    public Date dateOfLast(String event) {
        return dateOfLast(event, "time");
    }
}
