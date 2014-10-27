#!/ffp/bin/bash
ROOT="/mnt/HD/HD_a2/sync"
LOG="$ROOT/log"
HOST=192.168.99.14
MODULE=share
TMPDIR=`mktemp -d -t`
DEST='/mnt/HD/HD_a2/share/Incoming'
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
	rsync --bwlimit=512 $@
}

fetch() {
	_rsync -av rsync://$HOST/$MODULE/filelist $TMPDIR >>$LOG 2>&1
}

makediff() {
	diff --new-line-format='%L' --unchanged-line-format='' $COMPLETED $TMPDIR/filelist
}

[ -f $COMPLETED ] || touch $COMPLETED

case $COMMAND in  
	sync) 
	IFS=$'\n'

	fetch
	for element in `makediff`;do 
		echo "Transferring '$element'...."
		_rsync -av rsync://$HOST/$MODULE/$element $DEST >>$LOG 2>&1 && echo $element >>$COMPLETED
	done
	;;
	fetch)
	fetch
	makediff
	;;
esac

rm -rf $TMPDIR
