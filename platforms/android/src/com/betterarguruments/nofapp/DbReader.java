package com.betterarguruments.nofapp;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.io.File;
import java.util.Date;

/**
 * Warning: this class is far from complete.
 * TODO #1: add exception handling for not existing database file, e.g. prior to first launch.
 */
public class DbReader {
    // refactor into config file
    private final String DBFILE = "nofapp.db";
    protected SQLiteDatabase db;
    protected int SQLITE_ACCESS = SQLiteDatabase.OPEN_READONLY;
    private Context context;
    private File dbPath;
    private final String QUERY_JOIN_EVENTS = "SELECT ? FROM events JOIN event_types ON (event_types.id = events.type)";
    private final String QUERY_WHERE_EVENT_NAME = "WHERE event_types.name = ?";

    public DbReader(Context ctx) {
        this.context = ctx;
        this.dbPath = context.getDatabasePath(DBFILE);
        this.db = SQLiteDatabase.openDatabase(DBFILE, null, SQLITE_ACCESS);
    }

    public Date dateOfLast(String column) {
        // build the query from templates
        String query_time_last = QUERY_JOIN_EVENTS + " " + QUERY_WHERE_EVENT_NAME +
                " ORDER BY events.time DESC LIMIT 1";
        // Query time column
        Cursor cursor = db.rawQuery(query_time_last, new String[] {"time", column});
        // move cursor to first returned column
        // TODO: exception handling for no columns returned
        cursor.moveToFirst();
        int time = cursor.getInt(cursor.getColumnIndex("time"));
        return new Date(time * 1000);
    }
}
