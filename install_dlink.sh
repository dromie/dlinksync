#!/ffp/bin/bash

if [ ! -d "$1" ];then
	TMPDIR=`mktemp -d -t`
	pushd $TMPDIR
	curl https://codeload.github.com/dromie/dlinksync/zip/master >master.zip
	unzip master.zip
	if [ -d dlinksync-master ];then
		chmod +x dlinksync-master/`basename $0`
		dlinksync-master/`basename $0` $PWD/dlinksync-master
	fi
	popd
else
	pushd "$1"
	DEST=/ffp/opt/dlinksync
	mkdir -p $DEST
	cp * $DEST/
	ln -sf $DEST/manual_sync.cgi /var/www/cgi-bin/manual_sync.cgi
	ln -sf $DEST/manual_sync.html /var/www/manual_sync.html
	popd
fi

