#!/bin/bash

DIR=`pwd`

PACK="../../public/assets"

cd `dirname $0`

rm -rf ${PACK}/js ${PACK}/css
cp -r js css fonts images views res ${PACK}

#回到之前的目录
cd ${DIR}

exit 0