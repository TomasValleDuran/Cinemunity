package org.example.persistance;

import org.hsqldb.persist.HsqlProperties;

import java.sql.Connection;

public class Database {

    final String dbLocation = "/home/tomasvalle/Downloads/hsqldb-2.7.2/hsqldb/db/";
    org.hsqldb.server.Server server;

    public void startDBServer() {
        HsqlProperties props = new HsqlProperties();
        props.setProperty("server.database.0", "file:" + dbLocation + "cinemunityDB;");
        props.setProperty("server.dbname.0", "cinemunityDB");
        server = new org.hsqldb.Server();
        try {
            server.setProperties(props);
        } catch (Exception e) {
            return;
        }
        server.start();
    }

    public void stopDBServer() {
        server.shutdown();
    }

}

