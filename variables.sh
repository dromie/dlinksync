#!/ffp/bin/bash
export PATH=/opt/bin:/ffp/bin:$PATH
FILELIST="filelist"
ROOT="/mnt/HD/HD_a2/sync"
LOG="$ROOT/log"
HOST=192.168.99.14
MODULE=sync
TMPDIR=`mktemp -d -t`
DEST='/mnt/HD/HD_a2/sync/Incoming'
COMPLETED="$ROOT/completed"
