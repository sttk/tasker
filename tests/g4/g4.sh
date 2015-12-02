#!/bin/sh

THIS=`which $0`
CWD=`dirname ${THIS}`
node ${CWD}/../../src/g4/main.js "$@"
