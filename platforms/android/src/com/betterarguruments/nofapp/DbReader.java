package com.betterarguruments.nofapp;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.util.Log;

import java.io.File;
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
    private Boolean dbAvailable;
    private Context context;
    private File dbPath;
    private final String QUERY_JOIN_EVENTS = "FROM events JOIN event_types ON (event_types.id = events.type)";
    private final String QUERY_WHERE_EVENT_TYPE = "WHERE event_types.name = ?";

    public DbReader(Context ctx) {
        this.context = ctx;
        this.dbPath = context.getDatabasePath(DB_FILE);
        Log.d("NoFapp::DbReader", "DB at: " + this.dbPath.getPath().toString());
        try {
            this.db = SQLiteDatabase.openDatabase(this.dbPath.getPath(), null, SQLITE_ACCESS);
            this.dbAvailable = true;
        } catch (SQLiteException e) {
            this.dbAvailable = false;
        }
    }

    public Boolean isDbAvailable() {
        return this.dbAvailable;
    }

    public Date dateOfLast(String event_type, String time_col) {
        Cursor cursor = events(event_type, 1);
        // move cursor to first returned column
        cursor.moveToFirst();
        long time = cursor.getLong(cursor.getColumnIndex(time_col)) * 1000;
        return new Date(time);
    }

    public Date dateOfLast(String event) {
        return dateOfLast(event, "time");
    }

    public Cursor events(String event_type, int limit) {
        String query_events = "SELECT * " + QUERY_JOIN_EVENTS + " " + QUERY_WHERE_EVENT_TYPE + "ORDER BY events.time DESC";
        if (limit > 0) {
            query_events.concat(" LIMIT " + limit);
        }

        return db.rawQuery(query_events, new String[]{event_type});
    }

    public Cursor events(String event_type) {
        return events(event_type, 0);
    }
}
