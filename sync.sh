#!/ffp/bin/bash
source `dirname $0`/variables.sh
if [ "$1" == "cron" ];then
	exec 3>/dev/null
else
	exec 3>&1
fi
exec 4>>$LOG
exec >&4
exec 2>&4

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
	_rsync -avz rsync://$HOST/$MODULE/$FILELIST $TMPDIR >>$LOG 2>&1
}

makediff() {
	diff $COMPLETED $TMPDIR/$FILELIST |grep '^>'|cut -f2- -d' '|grep -v '^$'
}

[ -f $COMPLETED ] || touch $COMPLETED

case $COMMAND in  
	sync) 
	IFS=$'\n'

	fetch
	for element in `makediff`;do 
		echo "Transferring '$element'...." >&3
		_rsync -avz rsync://$HOST/$MODULE/$element $DEST >>$LOG 2>&1 && echo $element >>$COMPLETED
		export TR_TORRENTDIR=$DEST
		export TR_TORRENT_NAME=$element
		/ffp/bin/processSyncDone &
	done
	;;
	fetch)
	fetch
	makediff >&3
	;;
esac

rm -rf $TMPDIR
