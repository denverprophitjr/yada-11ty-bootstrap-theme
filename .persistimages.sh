#!/bin/sh

cp _site/img/remote/* img/remote/
cp _site/img/* img/
git status
git add img/
git commit -s -S -m "Persist Images"
