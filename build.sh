#!/bin/bash
npm run build
VERSION=`git rev-parse --abbrev-ref HEAD`
sed -i -- "s/%VERSION%/$VERSION/g" build/index.html
