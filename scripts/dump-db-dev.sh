#!/bin/bash

turso db shell finances .dump > dump.sql
cat dump.sql | sqlite3 finances.db
