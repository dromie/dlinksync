#!/ffp/bin/bash
ROOT="/mnt/HD/HD_a2/sync"
LOG="$ROOT/log"
HOST=192.168.99.14
MODULE=sync
TMPDIR=`mktemp -d -t`
DEST='/mnt/HD/HD_a2/sync/Incoming'
COMPLETED="$ROOT/completed"
#RSYNC="rsync --password-file=`dirname $0`/rsync.secret"
#get Filelist

COMMAND="sync"

if [ "$1" == "resync" ];then
	mv $COMPLETED $COMPLETED.backup.`date "+%y%m%d_%H%M%S"`
elif [ "$1" == "fetch" ];then
	COMMAND="fetch"
fi

_rsync() {
	/usr/sbin/rsync --bwlimit=512 $@
}

fetch() {
	_rsync -avz rsync://$HOST/$MODULE/filelist $TMPDIR >>$LOG 2>&1
}

makediff() {
	diff $COMPLETED $TMPDIR/filelist |grep '^>'|cut -f2- -d' '|grep -v '^$'
#	diff --new-line-format='%L' --unchanged-line-format='' $COMPLETED $TMPDIR/filelist
}

[ -f $COMPLETED ] || touch $COMPLETED

case $COMMAND in  
	sync) 
	IFS=$'\n'

	fetch
	for element in `makediff`;do 
		echo "Transferring '$element'...."
		_rsync -avz rsync://$HOST/$MODULE/$element $DEST >>$LOG 2>&1 && echo $element >>$COMPLETED
		export TR_TORRENTDIR=$DEST
		export TR_TORRENT_NAME=$element
		/ffp/bin/processSyncDone &
	done
	;;
	fetch)
	fetch
	makediff
	;;
esac

rm -rf $TMPDIR
