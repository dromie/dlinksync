#!/ffp/bin/bash
LOG="/ffp/home/root/HD/kutya/log"
HOST=192.168.99.1
MODULE=temporary
TMPDIR=`mktemp -d -t`
DEST='/ffp/home/root/HD/kutya/s'
COMPLETED="/ffp/home/root/HD/kutya/completed"
#get Filelist

COMMAND="sync"

if [ "$1" == "resync" ];then
	mv $COMPLETED $COMPLETED.backup.`date "+%y%m%d_%H%M%S"`
elif [ "$1" == "fetch" ];then
	COMMAND="fetch"
fi

fetch() {
	rsync -av rsync://$HOST/$MODULE/filelist $TMPDIR >>$LOG 2>&1
}

makediff() {
	diff --new-line-format='%L' --unchanged-line-format='' $COMPLETED $TMPDIR/filelist
}

case $COMMAND in  
	sync) 
	[ -f $COMPLETED ] || touch $COMPLETED
	fetch
	makediff
	for element in makediff;do 
		echo "Transferring '$element'...."
		rsync -av rsync://$HOST/$MODULE/$element $DEST >>$LOG 2>&1 && echo $element >>$COMPLETED
	done
	;;
	fetch)
	fetch
	makediff
	;;
esac

rm -rf $TMPDIR
