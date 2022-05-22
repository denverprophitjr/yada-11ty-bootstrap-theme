#!/bin/sh

cp _site/img/remote/* assets/img/remote/
cp _site/img/* assets/img/
git status
git add img/
git commit -s -S -m "Persist Images"
