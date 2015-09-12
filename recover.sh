#!/usr/bin/env bash

for f in ./.git/lost-found/other/*
do
    echo "$f"
    git show "$f" > "$f"
done