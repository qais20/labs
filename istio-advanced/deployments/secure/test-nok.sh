#!/bin/sh
if [ -x "$(command -v http)" ]; then
    http -v GET localhost:8080/secure Authorization:"Bearer NOTVALID"
else
    curl "http://localhost:8080/secure" -v -o /dev/null -H "Authorization: Bearer NOTVALID"
fi

